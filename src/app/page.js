// src/app/page.js

async function getProjects() {
  const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/project?_embed&per_page=100', {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const imageUrl = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;

          return (
            <div key={project.id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={project.title.rendered}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <a
                  href={`/project/${project.slug}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                  dangerouslySetInnerHTML={{ __html: project.title.rendered }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
