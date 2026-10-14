import { Head, Link, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';

const splits = [
  { name: 'Karim', paid: 600, due: 600 },
  { name: 'Salma', paid: 300, due: 400 },
  { name: 'Youssef', paid: 0, due: 200 },
];

const features = [
  {
    title: 'Fair shares, calculated for you',
    body: 'Set the yearly budget and a weight for each unit. Apartments, shops and storage rooms each get their exact share.',
  },
  {
    title: 'Billing that fits each household',
    body: 'Monthly, every two months, quarterly or twice a year. Families can split one share between several payers.',
  },
  {
    title: 'A ledger you can trust',
    body: 'Record cash, transfers and cheques. Partial payments, credits and cancelled entries stay visible and traceable.',
  },
  {
    title: 'Budgets that stay stable',
    body: 'When a unit joins or leaves mid-year, existing quotas do not change. Only the total budget is adjusted.',
  },
];

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
const primaryBtn = `inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 ${focus}`;
const ghostBtn = `inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${focus}`;

export default function Welcome() {
  const { auth } = usePage().props;
  const totalPaid = splits.reduce((sum, s) => sum + s.paid, 0);
  const totalDue = splits.reduce((sum, s) => sum + s.due, 0);

  return (
    <>
      <Head title="SyndicPro – Condo contributions, tracked" />
      <div className="min-h-screen bg-background text-foreground">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-3xl font-bold tracking-tight"
          >
            <img src="/logo.png" alt="" aria-hidden="true" className="size-12 object-contain" />
            <span>
              <span className="text-foreground">Syndic</span>
              <span className="text-[#4338CA]">Pro</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            {auth.user ? (
              <Link href="/onboarding/property" className={primaryBtn}>
                Continue
              </Link>
            ) : (
              <>
                <Link href={login()} className={ghostBtn}>
                  Log in
                </Link>
                <Link href={register()} className={primaryBtn}>
                  Get started
                </Link>
              </>
            )}
          </nav>
        </header>

        <main>
          <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 pb-20 lg:grid-cols-2 lg:pt-20">
            <div>
              <h1 className="max-w-xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
                Collect condo contributions without the spreadsheet.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                SyndicPro helps syndics in Morocco set the yearly budget, share it fairly between
                units, and follow every payment in dirhams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={auth.user ? '/onboarding/property' : register()} className={primaryBtn}>
                  {auth.user ? 'Continue' : 'Create your first condo'}
                </Link>
                {!auth.user && (
                  <Link href={login()} className={ghostBtn}>
                    I already have an account
                  </Link>
                )}
              </div>
            </div>

            {/* Sample installment: one shared goal, several payers */}
            <div
              className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
              aria-label="Example of a family split payment"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-medium">Apartment B2</p>
                  <p className="text-sm text-muted-foreground">
                    Quarterly installment, due 1 January
                  </p>
                </div>
                <p className="text-right font-heading text-2xl font-semibold tabular-nums">
                  {totalDue.toLocaleString('en-US')}
                  <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
                    MAD
                  </span>
                </p>
              </div>

              <ul className="mt-6 space-y-4">
                {splits.map((s) => {
                  const pct = Math.round((s.paid / s.due) * 100);

                  return (
                    <li key={s.name}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {s.paid} / {s.due} MAD
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${s.name} paid ${pct}%`}
                      >
                        <div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-primary' : 'bg-chart-2'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                {totalPaid} of {totalDue} MAD received. {totalDue - totalPaid} MAD still to collect.
              </p>
            </div>
          </section>

          <section className="border-t border-border bg-muted/40">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <h2 className="max-w-lg font-heading text-2xl font-semibold tracking-tight">
                Everything a syndic needs to keep the books clear
              </h2>
              <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
                {features.map((f) => (
                  <div key={f.title} className="border-t border-border pt-4">
                    <dt className="font-medium">{f.title}</dt>
                    <dd className="mt-2 leading-relaxed text-muted-foreground">{f.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-primary px-8 py-10 text-primary-foreground sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  Ready to set up your condo?
                </h2>
                <p className="mt-1 opacity-80">
                  Add your building, your units and this year’s budget.
                </p>
              </div>
              <Link
                href={auth.user ? '/onboarding/property' : register()}
                className={`inline-flex shrink-0 items-center rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background/90 ${focus}`}
              >
                {auth.user ? 'Continue' : 'Get started'}
              </Link>
            </div>
          </section>
        </main>

        <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} SyndicPro
        </footer>
      </div>
    </>
  );
}
