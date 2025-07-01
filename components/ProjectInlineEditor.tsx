"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export function ProjectInlineEditor({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState({ ...project });
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleSave(field: string, value: string) {
    setSaving((s) => ({ ...s, [field]: true }));
    setError(null);
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", project.id);
    setSaving((s) => ({ ...s, [field]: false }));
    if (error) setError(error.message);
  }

  function handleEdit(field: string) {
    if (!isCeo) return;
    setEditing((e) => ({ ...e, [field]: true }));
  }

  function handleBlur(field: string) {
    setEditing((e) => ({ ...e, [field]: false }));
    handleSave(field, values[field]);
  }

  function handleChange(field: string, value: string) {
    setValues((v: any) => ({ ...v, [field]: value }));
  }

  // Helper for rendering editable fields
  function editableField(field: string, type: "input" | "textarea" = "input", className = "") {
    if (editing[field]) {
      if (type === "textarea") {
        return (
          <Textarea
            className={className}
            value={values[field] || ""}
            autoFocus
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            rows={field === "highlights" ? 4 : 3}
            disabled={saving[field]}
          />
        );
      }
      return (
        <Input
          className={className}
          value={values[field] || ""}
          autoFocus
          onChange={e => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          disabled={saving[field]}
        />
      );
    }
    // Special formatting for estimated_price
    if (field === "estimated_price") {
      const val = values[field];
      let display = val;
      if (val && !isNaN(Number(val))) {
        display = `$${Number(val).toLocaleString()}`;
      }
      return (
        <span
          className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
          onClick={() => handleEdit(field)}
          tabIndex={isCeo ? 0 : -1}
          style={isCeo ? { outline: "none" } : {}}
        >
          {display || <span className="italic text-muted-foreground">(empty)</span>}
          {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
        </span>
      );
    }
    // For highlights, show as list
    if (field === "highlights") {
      let lines: string[] = [];
      if (Array.isArray(values[field])) {
        lines = values[field];
      } else if (typeof values[field] === "string") {
        lines = values[field].split(/\r?\n/).filter(Boolean);
      }
      return (
        <ul className="list-disc list-inside text-muted-foreground space-y-2" onClick={() => handleEdit(field)} style={isCeo ? { cursor: 'pointer' } : {}}>
          {lines.length > 0 ? lines.map((item: string, idx: number) => <li key={idx}>{item}</li>) : <li className="italic text-muted-foreground">(empty)</li>}
          {saving[field] && <li className="ml-2 text-xs text-blue-400">Saving...</li>}
        </ul>
      );
    }
    return (
      <span
        className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
        onClick={() => handleEdit(field)}
        tabIndex={isCeo ? 0 : -1}
        style={isCeo ? { outline: "none" } : {}}
      >
        {values[field] || <span className="italic text-muted-foreground">(empty)</span>}
        {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
      </span>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <h1 className="mb-4 text-4xl font-bold text-white">
          {editableField("title")}
        </h1>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mr-2">
            {editableField("category")}
          </span>
          <span className="text-xs text-muted-foreground">{editableField("location")}</span>
        </div>
        <div className="mb-4 text-muted-foreground">
          Completed: {editableField("year")}
        </div>
        <div className="mb-8 text-lg text-muted-foreground">
          {editableField("description", "textarea")}
        </div>
      </div>
      {/* Estimated Price */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Estimated Price</h2>
        <div className="text-3xl font-bold text-emerald-400 mb-2">
          {editableField("estimated_price")}
        </div>
        <div className="text-muted-foreground text-sm mb-4">Contact us for a custom quote for your project.</div>
      </div>
      {/* Project Highlights */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Project Highlights</h2>
        {editing["highlights"] ? (
          <Textarea
            className="w-full"
            value={values["highlights"] || ""}
            autoFocus
            onChange={e => handleChange("highlights", e.target.value)}
            onBlur={() => handleBlur("highlights")}
            rows={4}
            disabled={saving["highlights"]}
          />
        ) : (
          editableField("highlights")
        )}
      </div>
    </div>
  );
}

export function ProjectTitleAndDescription({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState({ ...project });
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleSave(field: string, value: string) {
    setSaving((s) => ({ ...s, [field]: true }));
    setError(null);
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", project.id);
    setSaving((s) => ({ ...s, [field]: false }));
    if (error) setError(error.message);
  }

  function handleEdit(field: string) {
    if (!isCeo) return;
    setEditing((e) => ({ ...e, [field]: true }));
  }

  function handleBlur(field: string) {
    setEditing((e) => ({ ...e, [field]: false }));
    handleSave(field, values[field]);
  }

  function handleChange(field: string, value: string) {
    setValues((v: any) => ({ ...v, [field]: value }));
  }

  // Helper for rendering editable fields
  function editableField(field: string, type: "input" | "textarea" = "input", className = "") {
    if (editing[field]) {
      if (type === "textarea") {
        return (
          <Textarea
            className={className}
            value={values[field] || ""}
            autoFocus
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            rows={field === "highlights" ? 4 : 3}
            disabled={saving[field]}
          />
        );
      }
      return (
        <Input
          className={className}
          value={values[field] || ""}
          autoFocus
          onChange={e => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          disabled={saving[field]}
        />
      );
    }
    // Special formatting for estimated_price
    if (field === "estimated_price") {
      const val = values[field];
      let display = val;
      if (val && !isNaN(Number(val))) {
        display = `$${Number(val).toLocaleString()}`;
      }
      return (
        <span
          className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
          onClick={() => handleEdit(field)}
          tabIndex={isCeo ? 0 : -1}
          style={isCeo ? { outline: "none" } : {}}
        >
          {display || <span className="italic text-muted-foreground">(empty)</span>}
          {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
        </span>
      );
    }
    // For highlights, show as list
    if (field === "highlights") {
      let lines: string[] = [];
      if (Array.isArray(values[field])) {
        lines = values[field];
      } else if (typeof values[field] === "string") {
        lines = values[field].split(/\r?\n/).filter(Boolean);
      }
      return (
        <ul className="list-disc list-inside text-muted-foreground space-y-2" onClick={() => handleEdit(field)} style={isCeo ? { cursor: 'pointer' } : {}}>
          {lines.length > 0 ? lines.map((item: string, idx: number) => <li key={idx}>{item}</li>) : <li className="italic text-muted-foreground">(empty)</li>}
          {saving[field] && <li className="ml-2 text-xs text-blue-400">Saving...</li>}
        </ul>
      );
    }
    return (
      <span
        className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
        onClick={() => handleEdit(field)}
        tabIndex={isCeo ? 0 : -1}
        style={isCeo ? { outline: "none" } : {}}
      >
        {values[field] || <span className="italic text-muted-foreground">(empty)</span>}
        {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
      </span>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <h1 className="mb-4 text-4xl font-bold text-white">
          {editableField("title")}
        </h1>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mr-2">
            {editableField("category")}
          </span>
          <span className="text-xs text-muted-foreground">{editableField("location")}</span>
        </div>
        <div className="mb-4 text-muted-foreground">
          Completed: {editableField("year")}
        </div>
        <div className="mb-8 text-lg text-muted-foreground">
          {editableField("description", "textarea")}
        </div>
      </div>
    </div>
  );
}

export function ProjectEstimatedPrice({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState({ ...project });
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleSave(field: string, value: string) {
    setSaving((s) => ({ ...s, [field]: true }));
    setError(null);
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", project.id);
    setSaving((s) => ({ ...s, [field]: false }));
    if (error) setError(error.message);
  }

  function handleEdit(field: string) {
    if (!isCeo) return;
    setEditing((e) => ({ ...e, [field]: true }));
  }

  function handleBlur(field: string) {
    setEditing((e) => ({ ...e, [field]: false }));
    handleSave(field, values[field]);
  }

  function handleChange(field: string, value: string) {
    setValues((v: any) => ({ ...v, [field]: value }));
  }

  // Helper for rendering editable fields
  function editableField(field: string, type: "input" | "textarea" = "input", className = "") {
    if (editing[field]) {
      if (type === "textarea") {
        return (
          <Textarea
            className={className}
            value={values[field] || ""}
            autoFocus
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            rows={field === "highlights" ? 4 : 3}
            disabled={saving[field]}
          />
        );
      }
      return (
        <Input
          className={className}
          value={values[field] || ""}
          autoFocus
          onChange={e => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          disabled={saving[field]}
        />
      );
    }
    // Special formatting for estimated_price
    if (field === "estimated_price") {
      const val = values[field];
      let display = val;
      if (val && !isNaN(Number(val))) {
        display = `$${Number(val).toLocaleString()}`;
      }
      return (
        <span
          className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
          onClick={() => handleEdit(field)}
          tabIndex={isCeo ? 0 : -1}
          style={isCeo ? { outline: "none" } : {}}
        >
          {display || <span className="italic text-muted-foreground">(empty)</span>}
          {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
        </span>
      );
    }
    // For highlights, show as list
    if (field === "highlights") {
      let lines: string[] = [];
      if (Array.isArray(values[field])) {
        lines = values[field];
      } else if (typeof values[field] === "string") {
        lines = values[field].split(/\r?\n/).filter(Boolean);
      }
      return (
        <ul className="list-disc list-inside text-muted-foreground space-y-2" onClick={() => handleEdit(field)} style={isCeo ? { cursor: 'pointer' } : {}}>
          {lines.length > 0 ? lines.map((item: string, idx: number) => <li key={idx}>{item}</li>) : <li className="italic text-muted-foreground">(empty)</li>}
          {saving[field] && <li className="ml-2 text-xs text-blue-400">Saving...</li>}
        </ul>
      );
    }
    return (
      <span
        className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
        onClick={() => handleEdit(field)}
        tabIndex={isCeo ? 0 : -1}
        style={isCeo ? { outline: "none" } : {}}
      >
        {values[field] || <span className="italic text-muted-foreground">(empty)</span>}
        {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
      </span>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Estimated Price</h2>
        <div className="text-3xl font-bold text-emerald-400 mb-2">
          {editableField("estimated_price")}
        </div>
        <div className="text-muted-foreground text-sm mb-4">Contact us for a custom quote for your project.</div>
      </div>
    </div>
  );
}

export function ProjectHighlights({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState({ ...project });
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleSave(field: string, value: string) {
    setSaving((s) => ({ ...s, [field]: true }));
    setError(null);
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", project.id);
    setSaving((s) => ({ ...s, [field]: false }));
    if (error) setError(error.message);
  }

  function handleEdit(field: string) {
    if (!isCeo) return;
    setEditing((e) => ({ ...e, [field]: true }));
  }

  function handleBlur(field: string) {
    setEditing((e) => ({ ...e, [field]: false }));
    handleSave(field, values[field]);
  }

  function handleChange(field: string, value: string) {
    setValues((v: any) => ({ ...v, [field]: value }));
  }

  // Helper for rendering editable fields
  function editableField(field: string, type: "input" | "textarea" = "input", className = "") {
    if (editing[field]) {
      if (type === "textarea") {
        return (
          <Textarea
            className={className}
            value={values[field] || ""}
            autoFocus
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            rows={field === "highlights" ? 4 : 3}
            disabled={saving[field]}
          />
        );
      }
      return (
        <Input
          className={className}
          value={values[field] || ""}
          autoFocus
          onChange={e => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          disabled={saving[field]}
        />
      );
    }
    // Special formatting for estimated_price
    if (field === "estimated_price") {
      const val = values[field];
      let display = val;
      if (val && !isNaN(Number(val))) {
        display = `$${Number(val).toLocaleString()}`;
      }
      return (
        <span
          className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
          onClick={() => handleEdit(field)}
          tabIndex={isCeo ? 0 : -1}
          style={isCeo ? { outline: "none" } : {}}
        >
          {display || <span className="italic text-muted-foreground">(empty)</span>}
          {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
        </span>
      );
    }
    // For highlights, show as list
    if (field === "highlights") {
      let lines: string[] = [];
      if (Array.isArray(values[field])) {
        lines = values[field];
      } else if (typeof values[field] === "string") {
        lines = values[field].split(/\r?\n/).filter(Boolean);
      }
      return (
        <ul className="list-disc list-inside text-muted-foreground space-y-2" onClick={() => handleEdit(field)} style={isCeo ? { cursor: 'pointer' } : {}}>
          {lines.length > 0 ? lines.map((item: string, idx: number) => <li key={idx}>{item}</li>) : <li className="italic text-muted-foreground">(empty)</li>}
          {saving[field] && <li className="ml-2 text-xs text-blue-400">Saving...</li>}
        </ul>
      );
    }
    return (
      <span
        className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
        onClick={() => handleEdit(field)}
        tabIndex={isCeo ? 0 : -1}
        style={isCeo ? { outline: "none" } : {}}
      >
        {values[field] || <span className="italic text-muted-foreground">(empty)</span>}
        {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
      </span>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Project Highlights</h2>
        {editing["highlights"] ? (
          <Textarea
            className="w-full"
            value={values["highlights"] || ""}
            autoFocus
            onChange={e => handleChange("highlights", e.target.value)}
            onBlur={() => handleBlur("highlights")}
            rows={4}
            disabled={saving["highlights"]}
          />
        ) : (
          editableField("highlights")
        )}
      </div>
    </div>
  );
}

export function ProjectCategoryLocation({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState({ ...project });
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleSave(field: string, value: string) {
    setSaving((s) => ({ ...s, [field]: true }));
    setError(null);
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", project.id);
    setSaving((s) => ({ ...s, [field]: false }));
    if (error) setError(error.message);
  }

  function handleEdit(field: string) {
    if (!isCeo) return;
    setEditing((e) => ({ ...e, [field]: true }));
  }

  function handleBlur(field: string) {
    setEditing((e) => ({ ...e, [field]: false }));
    handleSave(field, values[field]);
  }

  function handleChange(field: string, value: string) {
    setValues((v: any) => ({ ...v, [field]: value }));
  }

  function editableField(field: string, type: "input" | "textarea" = "input", className = "") {
    if (editing[field]) {
      return (
        <Input
          className={className}
          value={values[field] || ""}
          autoFocus
          onChange={e => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          disabled={saving[field]}
        />
      );
    }
    return (
      <span
        className={isCeo ? `cursor-pointer hover:underline ${className}` : className}
        onClick={() => handleEdit(field)}
        tabIndex={isCeo ? 0 : -1}
        style={isCeo ? { outline: "none" } : {}}
      >
        {values[field] || <span className="italic text-muted-foreground">(empty)</span>}
        {saving[field] && <span className="ml-2 text-xs text-blue-400">Saving...</span>}
      </span>
    );
  }

  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mr-2">
        {editableField("category")}
      </span>
      <span className="text-xs text-muted-foreground">{editableField("location")}</span>
    </div>
  );
} 