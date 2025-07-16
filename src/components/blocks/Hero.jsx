export default function Hero({ data }) {
  const { headline, subheadline, background_image } = data;

  return (
 <section
  className="relative text-white py-24 px-6 bg-center bg-cover"
  style={{
    backgroundImage: background_image?.url
      ? `url(${background_image.url})`
      : 'none'
  }}
>
  <div className="mx-auto text-center bg-black bg-opacity-50 p-8 rounded-lg">
    <h1 className="text-4xl font-bold mb-4">{headline}</h1>
    <p className="text-lg">{subheadline}</p>
  </div>
</section>

  );
}
