import { EditUrlContent } from "@/components/urls/edit-url-content";
import { siteConfig } from "@/config/site";
import { IUrl } from "@/types/url";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getUrl(id: string): Promise<IUrl | null> {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/urls/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data?.url || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const url = await getUrl(id);

  if (!url) {
    return {
      title: "Edit Link",
      description:
        "Edit and manage your shortened link settings, destination URL, and expiration",
    };
  }

  return {
    title: `Edit: ${url.shortId}`,
    description: `Edit settings for ${url.shortUrl || url.shortId} - ${
      url.originalUrl
    }`,
  };
}

export default async function EditUrlPage({ params }: PageProps) {
  const { id } = await params;
  return <EditUrlContent id={id} />;
}
