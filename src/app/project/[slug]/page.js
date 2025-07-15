// src/app/project/[slug]/page.js

async function getProject(slug) {
  const res = await fetch(`https://backend.petereichhorst.com/wp-json/wp/v2/project?slug=${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch project');
  }

  const data = await res.json();
  return data[0]; // return the first matching project
}

export async function generateStaticParams() {
  const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/project');
  const projects = await res.json();

  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);

  if (!project) {
    return <div className="p-6 text-red-600">Project not found.</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1
        className="text-3xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: project.title.rendered }}
      />
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: project.content.rendered }}
      />
    </main>
  );
}
