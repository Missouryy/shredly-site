(() => {
  const key = "shredly-site-theme";
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  function updateButton() {
    if (!button) return;
    const dark = currentTheme() === "dark";
    button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
    button.setAttribute("title", `Switch to ${dark ? "light" : "dark"} mode`);
    button.setAttribute("aria-pressed", String(dark));
  }

  button?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(key, next); } catch (_) { /* Browsing stays usable. */ }
    updateButton();
  });

  media.addEventListener?.("change", updateButton);
  updateButton();
})();
