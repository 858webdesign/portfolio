// src/app/page.js

async function getProjects() {
  const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/project?_embed&per_page=20', {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json();
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">My Projects</h1>

<div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/project/${project.slug}`}
            className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300 bg-white"
          >
            {project.featured_media && (
              <img
                src={project._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                alt={project.title.rendered}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2
                className="text-xl font-semibold"
                dangerouslySetInnerHTML={{ __html: project.title.rendered }}
              />

              {typeof project.excerpt?.rendered === 'string' &&
              project.excerpt.rendered.trim() !== '' && (
                <div
                  className="text-gray-600 text-sm mt-2"
                  dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
