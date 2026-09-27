import { useState, type FormEvent } from "react";
import {
  Bot,
  Check,
  CheckCircle2,
  Code2,
  FileCode2,
  Layers3,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

export type BuilderMode = "creator" | "developer";

export type AgentDraft = {
  name: string;
  role: string;
  framework: string;
  model: string;
  output: string;
  tone: "teal" | "violet";
  iconKind: BuilderMode;
  tools: string[];
};

type AgentBuilderProps = {
  mode: BuilderMode;
  defaultFramework: string;
  onClose: () => void;
  onCreate: (draft: AgentDraft) => void;
};

const creatorModels = ["Lyzr Auto", "GPT-4o mini", "Claude 3.5 Sonnet"];
const developerModels = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"];
const creatorFrameworks = ["Guided build", "Lyzr Core", "Visual-first"];
const developerFrameworks = ["Lyzr Core", "CrewAI", "LangChain", "FastAPI + React"];
const creatorTools = ["Web research", "Knowledge files", "Memory", "Human approval"];
const developerTools = ["Web search", "GitHub", "Postgres", "HTTP requests"];

function BuilderButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-[0_9px_28px_hsl(174_72%_52%_/_0.18)] hover:brightness-110",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold text-foreground">{children}</span>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function AgentBuilder({
  mode,
  defaultFramework,
  onClose,
  onCreate,
}: AgentBuilderProps) {
  const developer = mode === "developer";
  const [step, setStep] = useState<"configure" | "review">("configure");
  const [name, setName] = useState(developer ? "Signal research agent" : "New research agent");
  const [role, setRole] = useState(
    developer
      ? "Find meaningful patterns in customer signal and return evidence-backed findings."
      : "Research a topic, summarize what matters, and explain the next useful step.",
  );
  const [instructions, setInstructions] = useState(
    developer
      ? "You are a precise research agent. Cite sources, surface uncertainty, and return structured findings."
      : "Be clear, practical, and concise. Ask a follow-up question when the request is ambiguous.",
  );
  const [model, setModel] = useState(developer ? developerModels[0] : creatorModels[0]);
  const [framework, setFramework] = useState(defaultFramework);
  const [tools, setTools] = useState<string[]>(developer ? ["Web search", "GitHub"] : ["Web research", "Memory"]);
  const [temperature, setTemperature] = useState(developer ? "0.2" : "Balanced");
  const [error, setError] = useState("");

  const toggleTool = (tool: string) => {
    setTools((current) =>
      current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool],
    );
  };

  const review = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError("Add an agent name and a clear goal before continuing.");
      return;
    }
    setError("");
    setStep("review");
  };

  const create = () => {
    onCreate({
      name: name.trim(),
      role: role.trim(),
      framework,
      model,
      output: developer ? "Typed tool calls + branch-ready runs" : "Guided responses + inspectable runs",
      tone: developer ? "violet" : "teal",
      iconKind: mode,
      tools,
    });
  };

  const availableModels = developer ? developerModels : creatorModels;
  const availableFrameworks = developer ? developerFrameworks : creatorFrameworks;
  const availableTools = developer ? developerTools : creatorTools;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-labelledby="agent-builder-title">
      <div className="mx-auto flex min-h-full max-w-[1120px] items-center justify-center">
        <div className="my-3 flex w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:my-8">
          <div className="hidden w-[230px] shrink-0 flex-col border-r border-border bg-sidebar p-5 md:flex">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className={`grid size-8 place-items-center rounded-lg ${developer ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                {developer ? <Code2 size={16} /> : <WandSparkles size={16} />}
              </div>
              {developer ? "Developer agent" : "Creator agent"}
            </div>
            <div className="mt-10 space-y-3">
              {[
                ["01", "Configure", "Identity, model, tools"],
                ["02", "Review", "Check the run contract"],
              ].map(([number, label, detail], index) => {
                const active = step === (index === 0 ? "configure" : "review");
                return (
                  <div key={label} className={`rounded-xl border p-3 ${active ? (developer ? "border-accent/35 bg-accent/5" : "border-primary/35 bg-primary/5") : "border-transparent"}`}>
                    <div className={`font-mono text-[10px] ${active ? (developer ? "text-accent" : "text-primary") : "text-muted-foreground"}`}>{number}</div>
                    <div className="mt-2 text-xs font-semibold">{label}</div>
                    <div className="mt-1 text-[10px] leading-4 text-muted-foreground">{detail}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto rounded-xl border border-border bg-background p-3 text-[10px] leading-5 text-muted-foreground">
              <ShieldCheck size={14} className={`mb-2 ${developer ? "text-accent" : "text-primary"}`} />
              Nothing runs until you review and create the agent.
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
              <div>
                <div className={`font-mono text-[10px] uppercase tracking-[.18em] ${developer ? "text-accent" : "text-primary"}`}>
                  Agent builder / {step === "configure" ? "configure" : "review"}
                </div>
                <h2 id="agent-builder-title" className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {step === "configure" ? "Create an agent" : "Review before creating"}
                </h2>
                <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
                  {developer
                    ? "Define the runtime contract, model, framework, and tools this agent is allowed to use."
                    : "Give your agent a clear job, choose how it thinks, and keep the first run easy to inspect."}
                </p>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Close agent builder" data-testid="button-close-agent-builder">
                <X size={17} />
              </button>
            </header>

            {step === "configure" ? (
              <form onSubmit={review} className="p-5 sm:p-7">
                <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                  <section className="space-y-5">
                    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold"><Bot size={15} className={developer ? "text-accent" : "text-primary"} /> Identity and purpose</div>
                      <div className="mt-5 space-y-4">
                        <label className="block">
                          <FieldLabel hint="Required">Agent name</FieldLabel>
                          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Research analyst" className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" data-testid="input-new-agent-name" />
                        </label>
                        <label className="block">
                          <FieldLabel hint="Required">What should it do?</FieldLabel>
                          <textarea value={role} onChange={(event) => setRole(event.target.value)} placeholder="Describe the outcome this agent owns…" className="mt-2 min-h-[105px] w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm leading-5 outline-none focus:border-primary" data-testid="input-new-agent-role" />
                        </label>
                        <label className="block">
                          <FieldLabel>{developer ? "System instructions" : "Behavior guidance"}</FieldLabel>
                          <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} className="mt-2 min-h-[105px] w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm leading-5 outline-none focus:border-primary" data-testid="input-new-agent-instructions" />
                        </label>
                      </div>
                    </div>

                    <div className={`rounded-xl border p-4 sm:p-5 ${developer ? "border-accent/25 bg-accent/5" : "border-primary/25 bg-primary/5"}`}>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <SlidersHorizontal size={15} className={developer ? "text-accent" : "text-primary"} />
                        {developer ? "Runtime contract" : "Agent capabilities"}
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <FieldLabel>Model</FieldLabel>
                          <select value={model} onChange={(event) => setModel(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs outline-none focus:border-primary" data-testid="select-new-agent-model">
                            {availableModels.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <FieldLabel>Agent framework</FieldLabel>
                          <select value={framework} onChange={(event) => setFramework(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs outline-none focus:border-primary" data-testid="select-new-agent-framework">
                            {availableFrameworks.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </label>
                        <label className="block sm:col-span-2">
                          <FieldLabel hint={developer ? "0 = deterministic · 1 = exploratory" : "Tune later in agent settings"}>{developer ? "Temperature" : "Response style"}</FieldLabel>
                          {developer ? (
                            <div className="mt-2 flex items-center gap-3">
                              <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(event) => setTemperature(event.target.value)} className="w-full accent-[hsl(var(--accent))]" data-testid="input-new-agent-temperature" />
                              <span className="w-8 rounded-md border border-border bg-card px-1.5 py-1 text-center font-mono text-[10px]">{temperature}</span>
                            </div>
                          ) : (
                            <select value={temperature} onChange={(event) => setTemperature(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs outline-none focus:border-primary" data-testid="select-new-agent-style">
                              <option>Balanced</option>
                              <option>Concise</option>
                              <option>Detailed</option>
                            </select>
                          )}
                        </label>
                      </div>
                    </div>
                  </section>

                  <aside className="rounded-xl border border-border bg-sidebar p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold"><Zap size={15} className={developer ? "text-accent" : "text-primary"} /> Allowed tools</div>
                    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                      {developer ? "Choose explicit capabilities for this agent runtime." : "Start small. You can expand the agent after its first run."}
                    </p>
                    <div className="mt-5 space-y-2">
                      {availableTools.map((tool) => {
                        const enabled = tools.includes(tool);
                        return (
                          <button key={tool} type="button" onClick={() => toggleTool(tool)} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${enabled ? (developer ? "border-accent/35 bg-accent/5" : "border-primary/35 bg-primary/5") : "border-border bg-background hover:bg-secondary"}`} data-testid={`toggle-new-agent-tool-${tool.toLowerCase().replaceAll(" ", "-")}`}>
                            <span className={`grid size-5 place-items-center rounded-md border ${enabled ? (developer ? "border-accent bg-accent text-accent-foreground" : "border-primary bg-primary text-primary-foreground") : "border-border text-transparent"}`}><Check size={12} /></span>
                            <span className="text-xs font-medium">{tool}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 border-t border-border pt-4">
                      <div className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Build summary</div>
                      <div className="mt-3 space-y-2 text-[11px] text-muted-foreground">
                        <div className="flex justify-between gap-3"><span>Model</span><span className="text-foreground">{model}</span></div>
                        <div className="flex justify-between gap-3"><span>Framework</span><span className="text-foreground">{framework}</span></div>
                        <div className="flex justify-between gap-3"><span>Tools enabled</span><span className="text-foreground">{tools.length}</span></div>
                      </div>
                    </div>
                  </aside>
                </div>

                {error && <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive" data-testid="status-new-agent-error">{error}</div>}
                <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground"><ShieldCheck size={13} className={developer ? "text-accent" : "text-primary"} /> Review required before the agent can run</div>
                  <div className="flex gap-2"><BuilderButton variant="secondary" onClick={onClose}>Cancel</BuilderButton><BuilderButton type="submit"><Sparkles size={14} /> Review agent <CheckCircle2 size={14} /></BuilderButton></div>
                </div>
              </form>
            ) : (
              <div className="p-5 sm:p-7">
                <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
                  <section className="rounded-xl border border-border bg-background p-5">
                    <div className="flex items-start gap-3">
                      <div className={`grid size-11 place-items-center rounded-xl ${developer ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                        {developer ? <Code2 size={20} /> : <WandSparkles size={20} />}
                      </div>
                      <div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">New {developer ? "developer" : "creator"} agent</div><h3 className="mt-1 text-xl font-semibold">{name}</h3><p className="mt-1 text-xs text-muted-foreground">{role}</p></div>
                    </div>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {[["Model", model, FileCode2], ["Framework", framework, Layers3], ["Tools", `${tools.length} enabled`, Zap], ["Mode", developer ? "Developer Pro" : "Creator", developer ? Code2 : WandSparkles]].map(([label, value, Icon]) => <div key={label as string} className="rounded-lg border border-border bg-card p-3"><div className="flex items-center gap-2 text-[10px] text-muted-foreground"><Icon size={12} />{label as string}</div><div className="mt-2 text-xs font-semibold">{value as string}</div></div>)}
                    </div>
                    <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-primary">First run:</span> {developer ? "The agent will be available on its isolated branch with typed tool calls." : "The agent will be ready for a guided run with its selected capabilities."}</div>
                  </section>
                  <aside className="rounded-xl border border-border bg-sidebar p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold"><CheckCircle2 size={15} className="text-primary" /> Ready to create</div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">You can change these settings later from the agent detail panel.</p>
                    <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                      {tools.length > 0 ? tools.map((tool) => <div key={tool} className="flex items-center gap-2"><Check size={13} className="text-primary" />{tool}</div>) : <div className="rounded-lg border border-border bg-background p-3">No external tools enabled.</div>}
                    </div>
                  </aside>
                </div>
                <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                  <BuilderButton variant="outline" onClick={() => setStep("configure")}><SlidersHorizontal size={14} /> Edit configuration</BuilderButton>
                  <div className="flex gap-2"><BuilderButton variant="secondary" onClick={onClose}>Cancel</BuilderButton><BuilderButton onClick={create}><Sparkles size={14} /> Create agent</BuilderButton></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}