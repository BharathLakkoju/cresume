import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth-helpers";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    dates: string;
    location: string;
    bullets: string[];
  }>;
  skills: Array<{ category: string; items: string[] }>;
  projects: Array<{
    name: string;
    tech: string;
    link: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  certifications: string[];
  awards: string[];
}

/**
 * GET /api/profile
 * Returns the authenticated user's saved profile, or null if none exists.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = getSupabaseServiceClient();
  if (!service) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await service
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found (expected for new users)
    console.error("[profile] GET error:", error.message);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ profile: null });
  }

  const profile: ProfileData = {
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    location: data.location ?? "",
    linkedin: data.linkedin ?? "",
    github: data.github ?? "",
    summary: data.summary ?? "",
    experience: (data.experience as ProfileData["experience"]) ?? [],
    skills: (data.skills as ProfileData["skills"]) ?? [],
    projects: (data.projects as ProfileData["projects"]) ?? [],
    education: (data.education as ProfileData["education"]) ?? [],
    certifications: (data.certifications as string[]) ?? [],
    awards: (data.awards as string[]) ?? [],
  };

  return NextResponse.json({ profile });
}

/**
 * PUT /api/profile
 * Upserts the authenticated user's profile.
 */
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = getSupabaseServiceClient();
  if (!service) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: { profile?: ProfileData };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const p = body.profile;
  if (!p) {
    return NextResponse.json({ error: "Profile data is required" }, { status: 400 });
  }

  // Determine whether profile is "complete enough" for builder use
  const isComplete =
    Boolean(p.name?.trim()) &&
    ((p.experience?.length ?? 0) > 0 || (p.projects?.length ?? 0) > 0) &&
    (p.skills?.length ?? 0) > 0;

  const row = {
    user_id: user.id,
    name: p.name?.trim() ?? "",
    email: p.email?.trim() ?? "",
    phone: p.phone?.trim() ?? "",
    location: p.location?.trim() ?? "",
    linkedin: p.linkedin?.trim() ?? "",
    github: p.github?.trim() ?? "",
    summary: p.summary?.trim() ?? "",
    experience: p.experience ?? [],
    skills: p.skills ?? [],
    projects: p.projects ?? [],
    education: p.education ?? [],
    certifications: (p.certifications ?? []).filter((c: string) => c.trim()),
    awards: (p.awards ?? []).filter((a: string) => a.trim()),
    is_complete: isComplete,
    updated_at: new Date().toISOString(),
  };

  const { error } = await service
    .from("user_profiles")
    .upsert(row, { onConflict: "user_id" });

  if (error) {
    console.error("[profile] PUT error:", error.message);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true, isComplete });
}
