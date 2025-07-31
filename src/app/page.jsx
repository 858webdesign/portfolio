import Link from 'next/link';
import { getMetadata } from '@/lib/getMetadata';

export async function generateMetadata() {
  return await getMetadata('home');
}

async function getProjects() {
  const res = await fetch(
    'https://backend.petereichhorst.com/wp-json/wp/v2/project?_embed&per_page=20',
    { cache: 'no-store' } // disables Next.js caching
  );

  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}



function getScreenshotUrl(siteUrl) {
  const base = 'https://shot.screenshotapi.net/screenshot';
  const token = '7VG8M37-1NSMNFY-JD8CWYT-6GCE8RP';
  return `${base}?token=${token}&url=${encodeURIComponent(siteUrl)}&output=image&file_type=png&full_page=true`;
}

function getRandomFallbackImage() {
  // Returns a random 600x400 image
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${randomId}/600/700`;
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-700">My Projects:</h1>

      <style>{`
        .scroll-container {
          height: 292px;
          overflow: hidden;
          position: relative;
        }
        .scroll-inner {
          display: block;
          height: auto;
          animation: scrollY 20s linear infinite;
        }
        .scroll-container:hover .scroll-inner {
          animation-play-state: paused;
        }
        @keyframes scrollY {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center text-black">
        {projects.map((project) => {
          const featuredImage = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const projectUrl = project.acf?.url || project.meta?.url;
          const screenshot = projectUrl ? getScreenshotUrl(projectUrl) : null;
          const previewImage = featuredImage || screenshot || getRandomFallbackImage();

          return (
            <Link
              key={project.id}
              href={`/project/${project.slug}`}
              prefetch={false}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300 bg-white"
            >
              <div className="scroll-container">
                <img
                  src={previewImage}
                  alt={project.title.rendered}
                  className="w-full scroll-inner transform hover:scale-[1.02] transition-transform"
                />
              </div>

              <div className="p-4">
                <h2
                  className="text-xl font-semibold"
                  dangerouslySetInnerHTML={{ __html: project.title.rendered }}
                />
                {project.excerpt?.rendered?.trim() && (
                  <div
                    className="text-gray-600 text-sm mt-2"
                    dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
