import Link from "next/link";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lurexa Platform</h1>
            <p className="text-slate-500">Your learning workspace starts here</p>
          </div>
          <Badge variant="success">Ready to learn</Badge>
        </div>

        {/* Course Card Example */}
        <Card
          title="Mathematics — Module 1"
          subtitle="Algebraic Foundations & Logic"
          action={<Badge variant="info">In Progress</Badge>}
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Overall Progress</span>
                <span>65%</span>
              </div>
              <ProgressBar value={65} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in to continue
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-base font-medium text-slate-900 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Create an account
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
