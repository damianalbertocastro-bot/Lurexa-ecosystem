"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LearnAuthFrame } from "../../components/LearnAuthFrame";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"teacher" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [studentPath, setStudentPath] = useState<"self-paced" | "class">("self-paced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await AuthService.register(email, password);
      if (mode === "teacher") {
        if (!orgName) throw new Error("Organization name is required.");
        await OrganizationService.createOrganization(orgName, orgName.toLowerCase().replace(/[^a-z0-9]/g, "-"), user.uid);
      } else if (studentPath === "class") {
        if (!inviteCode) throw new Error("Invitation code is required.");
        await OrganizationService.joinViaCode(user.uid, user.email ?? email, inviteCode);
      }
      router.replace(mode === "teacher" ? "/teacher/dashboard" : studentPath === "self-paced" ? "/onboarding" : "/dashboard");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LearnAuthFrame eyebrow="START WITH THE RIGHT EXPERIENCE" title="One account. A learning path that can grow with you." description="Learners can begin independently or join a class. Educators create the Learn workspace they use to operate courses, lessons, invitations, and learner support.">
      <div className="rounded-[30px] border border-[#dfe6f8] bg-white p-6 shadow-[0_22px_60px_rgba(35,48,133,.1)] sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[.18em] text-[#592bd6]">CREATE A LUREXA LEARN ACCOUNT</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-.045em] text-[#071d67]">Choose how you are entering Learn.</h2>
        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-[#eef3ff] p-1.5">
          {(["student", "teacher"] as const).map((value) => <button key={value} type="button" onClick={() => setMode(value)} className={`min-h-11 rounded-xl px-3 text-sm font-extrabold transition ${mode === value ? "bg-white text-[#592bd6] shadow-sm" : "text-[#6677a5]"}`}>{value === "student" ? "Learner" : "Educator"}</button>)}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input id="email" label="Email Address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

          {mode === "teacher" ? <Input id="organization-name" label="School / Institution Name" placeholder="e.g. Lincoln High School" value={orgName} onChange={(event) => setOrgName(event.target.value)} required /> : <div className="space-y-3"><p className="text-sm font-extrabold text-[#10245f]">How are you starting?</p>{[
            ["self-paced", "Learn independently", "Start a self-paced English path with no class code."],
            ["class", "Join a teacher’s class", "Use the invitation code your teacher gave you."],
          ].map(([value, label, description]) => <label key={value} className={`block cursor-pointer rounded-2xl border p-4 transition ${studentPath === value ? "border-[#592bd6] bg-[#f3f1ff] ring-2 ring-[#ddd6ff]" : "border-[#dfe6f8] hover:border-[#b9c8ee]"}`}><input type="radio" name="student-path" className="mr-3" checked={studentPath === value} onChange={() => setStudentPath(value as "self-paced" | "class")} /><span className="font-extrabold text-[#10245f]">{label}</span><span className="mt-1 block text-xs leading-5 text-[#6677a5]">{description}</span></label>)}{studentPath === "class" ? <Input id="invite-code" label="6-Character Class Code" placeholder="e.g. X7K9PQ" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} required /> : null}</div>}

          {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>{mode === "teacher" ? "Create educator workspace →" : studentPath === "self-paced" ? "Create my learning path →" : "Join class →"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-[#6677a5]">Already have an account? <a href="/login" className="font-extrabold text-[#592bd6] hover:text-[#315fd7]">Sign in</a></p>
      </div>
    </LearnAuthFrame>
  );
}
