interface OgData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  publishedDate: string;
}

export async function fetchOgData(url: string): Promise<OgData | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract Open Graph tags
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogSiteName = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Extract publication date from various meta tags
    const ogPublishedTime = html.match(/<meta[^>]*property=["'](?:article:published_time|og:published_time)["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const datePublished = html.match(/<meta[^>]*(?:name|property)=["'](?:datePublished|publishdate|date)["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Fallback to regular title if og:title not found
    const title = ogTitle || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '';

    // Fallback to meta description if og:description not found
    const description = ogDescription || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Use the first available date, format it nicely
    const rawDate = ogPublishedTime || datePublished;
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

    return {
      title: title.trim(),
      description: description.trim(),
      image: ogImage.trim(),
      siteName: ogSiteName.trim(),
      url,
      publishedDate: formattedDate,
    };
  } catch (error) {
    console.error(`Error fetching OG data for ${url}:`, error);
    return null;
  }
}
