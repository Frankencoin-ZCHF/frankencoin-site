interface YouTubeData {
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  url: string;
  publishedDate: string;
  videoId: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&#34;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&nbsp;': ' ',
    '&#160;': ' ',
  };

  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

export async function fetchYouTubeData(url: string): Promise<YouTubeData | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      console.error(`Could not extract video ID from ${url}`);
      return null;
    }

    // Fetch the YouTube page to get metadata
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract metadata from Open Graph tags
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const author = html.match(/<link[^>]*itemprop=["']name["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Extract publication date
    const datePublished = html.match(/<meta[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const uploadDate = html.match(/<meta[^>]*itemprop=["']uploadDate["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Format the date
    const rawDate = datePublished || uploadDate;
    let formattedDate = '';
    if (rawDate) {
      try {
        const date = new Date(rawDate);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }

    // Use YouTube's reliable thumbnail URL directly
    // hqdefault.jpg (480x360) is always available for all videos
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    return {
      title: decodeHtmlEntities(ogTitle.trim()),
      description: decodeHtmlEntities(ogDescription.trim()),
      thumbnail,
      author: decodeHtmlEntities(author.trim()),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      publishedDate: formattedDate,
      videoId,
    };
  } catch (error) {
    console.error(`Error fetching YouTube data for ${url}:`, error);
    return null;
  }
}
