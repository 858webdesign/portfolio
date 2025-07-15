// src/app/page.js

async function getProjects() {
  const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/project?_embed&per_page=20', {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

function getScreenshotUrl(siteUrl) {
  const base = 'https://shot.screenshotapi.net/screenshot';
  const token = '7VG8M37-1NSMNFY-JD8CWYT-6GCE8RP'; // You may want to store this securely
 // return `${base}?token=${token}&url=${encodeURIComponent(siteUrl)}&output=image&file_type=png&full_page=true`;
return `${base}?token=${token}&url=${encodeURIComponent(siteUrl)}&output=image&file_type=png&full_page=true&delay=3000&wait_for_event=load`;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">My Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
        {projects.map((project) => {
          const featuredImage = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const projectUrl = project.acf?.url || project.meta?.url || 'https://petereichhorst.com';
          const previewImage = featuredImage || getScreenshotUrl(projectUrl);

          return (
            <a
              key={project.id}
              href={`/project/${project.slug}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300 bg-white"
            >
              <img
                src={previewImage}
                alt={project.title.rendered}
                className="w-full h-48 object-cover"
              />

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
            </a>
          );
        })}
      </div>
    </main>
  );
}
