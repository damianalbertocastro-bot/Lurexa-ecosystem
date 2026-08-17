"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AuthService, OrganizationService } from "@lurexa/backend";

export default function SignupPage() {
  const [mode, setMode] = useState<"teacher" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register User in Firebase Auth
      const user = await AuthService.register(email, password);

      // 2. Process Organization Assignment
      if (mode === "teacher") {
        if (!orgName) throw new Error("Organization name is required.");
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        await OrganizationService.createOrganization(orgName, slug, user.uid);
      } else {
        if (!inviteCode) throw new Error("Invitation code is required.");
        await OrganizationService.joinViaCode(user.uid, user.email ?? email, inviteCode);
      }

      window.location.href = mode === "teacher" ? "/teacher/dashboard" : "/dashboard";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card title="Create your Lurexa Account" subtitle="Join or create an institution" className="w-full max-w-md">
        <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "student" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
            onClick={() => setMode("student")}
          >
            I am a Student
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "teacher" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
            onClick={() => setMode("teacher")}
          >
            I am an Educator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "teacher" ? (
            <Input
              id="organization-name"
              label="School / Institution Name"
              placeholder="e.g. Lincoln High School"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          ) : (
            <Input
              id="invite-code"
              label="6-Character Class Code"
              placeholder="e.g. X7K9PQ"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            {mode === "teacher" ? "Create School Account" : "Join Class"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
