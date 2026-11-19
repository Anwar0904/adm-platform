/**
 * Public contact identity. Values stay empty until an owner verifies them;
 * components should omit unknown contact and social links.
 */
export const companyContact = {
  email: null as string | null,
  phone: null as string | null,
  address: null as string | null,
  socialProfiles: [] as Array<{ label: string; href: string }>,
} as const;
