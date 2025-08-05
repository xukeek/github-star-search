import { NavUser } from "./nav-user";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    {/* TODO: Add Logo */}
                    <a href="/dashboard" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Starry AI Navigator</span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <NavUser />
                    </nav>
                </div>
            </div>
        </header>
    );
}
