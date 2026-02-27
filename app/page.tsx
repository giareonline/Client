export default function Home() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Main Content</h2>

      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="mb-4 p-6 bg-gray-50 rounded border">
          Nội dung bài viết {i + 1}
        </div>
      ))}
    </>
  );
}
