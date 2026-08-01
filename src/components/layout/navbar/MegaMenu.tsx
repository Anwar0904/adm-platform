import Link from "next/link";

type Props = {
    items: {
        title: string;
        description: string;
        href: string;
        icon: any;
    }[];
};

export default function MegaMenu({
    items,
}: Props) {
    return (
        <div className="absolute left-0 top-full hidden w-155 rounded-2xl border bg-white p-6 shadow-xl group-hover:block">

            <div className="grid grid-cols-2 gap-4">

                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex gap-4 rounded-xl p-4 transition hover:bg-blue-50"
                        >
                            <Icon className="mt-1 h-5 w-5 text-blue-600" />

                            <div>

                                <h4 className="font-semibold">
                                    {item.title}
                                </h4>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.description}
                                </p>

                            </div>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
}