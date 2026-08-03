import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navigation } from "./menu";
import MegaMenu from "./MegaMenu";


export default function DesktopMenu() {
    return (
        <nav className="hidden lg:flex items-center gap-8">

            {navigation.map((item) => (

                <div
                    key={item.title}
                    className="group relative"
                >

                    {"mega" in item ? (
                        <>

                            <button className="flex items-center gap-1 font-medium">
                                <Link href={item.href!} className="font-medium transition hover:text-blue-600">
                                
                                {item.title}
                                </Link>

                                <ChevronDown
                                    size={16}
                                />

                            </button>

                            <MegaMenu
                                items={item.items ?? []}
                            />

                        </>
                    ) : (
                        <Link
                            href={item.href!}
                            className="font-medium transition hover:text-blue-600"
                        >
                            {item.title}
                        </Link>
                    )}

                </div>

            ))}

        </nav>
    );
}