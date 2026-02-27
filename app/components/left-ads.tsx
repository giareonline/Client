export default function LeftAds() {
    return (
      <aside className="hidden xl:block w-52">
        <div className="sticky top-20 flex flex-col gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="h-40 bg-yellow-400 rounded flex items-center justify-center font-bold text-xl shadow"
            >
              {num}
            </div>
          ))}
        </div>
      </aside>
    );
  }