export default function RightAds() {
    return (
      <aside className="hidden md:block w-52">
        <div className="sticky top-20 flex flex-col gap-4">
          {[5, 6, 7, 8].map((num) => (
            <div
              key={num}
              className="h-40 bg-green-400 rounded flex items-center justify-center font-bold text-xl shadow"
            >
              {num}
            </div>
          ))}
        </div>
      </aside>
    );
  }