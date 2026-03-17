import { Show, createMemo } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { useLanguage } from "@/context/language"
import { useLayout } from "@/context/layout"
import { useSync } from "@/context/sync"

export function GitGraphPanel() {
  const layout = useLayout()
  const sync = useSync()
  const language = useLanguage()

  const branch = createMemo(() => sync.data.vcs?.branch)
  const isGit = createMemo(() => sync.project?.vcs === "git")

  return (
    <div
      class="flex flex-col shrink-0 h-full overflow-hidden bg-background-stronger border-r border-border-weak-base"
      style={{ width: `${layout.gitGraph.width()}px` }}
      role="region"
      aria-label={language.t("session.gitGraph.title")}
    >
      <div class="h-10 flex items-center justify-between gap-2 px-2 border-b border-border-weaker-base shrink-0">
        <span class="flex items-center gap-2 text-14-regular text-text-strong truncate">
          <Icon name="branch" size="small" class="text-icon-base shrink-0" />
          {language.t("session.gitGraph.title")}
        </span>
        <IconButton
          icon="close"
          variant="ghost"
          iconSize="small"
          onClick={() => layout.gitGraph.toggle()}
          aria-label={language.t("common.close")}
        />
      </div>
      <div class="flex-1 min-h-0 overflow-auto p-2">
        <Show when={!isGit()} fallback={<BranchLine branch={branch()} />}>
          <p class="text-14-regular text-text-weak">{language.t("session.review.noVcs")}</p>
        </Show>
      </div>
    </div>
  )
}

function BranchLine(props: { branch: string | undefined }) {
  const language = useLanguage()
  if (!props.branch) return <p class="text-14-regular text-text-weak">{language.t("session.gitGraph.noBranch")}</p>
  return (
    <div class="flex items-center gap-2 text-14-regular text-text-base">
      <span class="font-medium">{props.branch}</span>
    </div>
  )
}
