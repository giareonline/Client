import Image from "next/image";
import AccountDropdown from "../home/components/account-dropdown";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-green-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={"/home"} className="flex items-center">
          <Image alt="logo" width={40} height={30} src="/logo.png" />
        </Link>

        {/* Account Dropdown */}
        <div className="flex items-center">
          {" "}
          <Link href="#" className="hover:underline text-sm">
            Hướng dẫn đặt vé
          </Link>
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}
