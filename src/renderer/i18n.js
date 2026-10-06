(() => {
  const translations = {
    de: {
      'brand.sub': 'Dein Projektassistent – einfach erklärt.',
      'persona.soft': 'Einfach',
      'persona.label': 'Ansprache',
      'model.label': 'Modell',
      'status.starting': 'Engine startet …',
      'status.ready': 'Bereit',
      'status.busy': '{agent} arbeitet …',
      'status.changing_model': 'Modell wird gewechselt …',
      'status.changing_persona': 'Ansprache wird gewechselt …',
      'status.error': 'Fehler – siehe Terminal',
      'banner.danger': '⚠ Freigaben deaktiviert (--dangerously-skip-permissions) – Aktionen werden ohne Rückfrage ausgeführt.',
      'nav.chat': 'Chat',
      'nav.terminal': 'Terminal',
      'nav.learning': 'Lernpfade',
      'nav.projects': 'Projekte',
      'nav.explorer': 'Explorer',
      'hint.main': 'Nichts mit Außenwirkung passiert ohne deine Freigabe. Entwürfe siehst du zuerst.',
      'hint.danger': 'Achtung: Freigaben sind abgeschaltet – Aktionen laufen ohne Rückfrage.',
      'hint.explorer': 'Ziehe eine Datei oder einen Ordner in den Chat – der Pfad wird automatisch eingesetzt.',
      'terminal.title': 'Terminal-Sichtfenster',
      'terminal.sub': 'Zeigt live, was {agent} im Hintergrund tatsächlich tut. Nur zum Zuschauen – hier muss nichts eingegeben werden.',
      'terminal.clear': 'Leeren',
      'learning.title': 'Lernpfade',
      'learning.sub': 'Kurze, geführte Einstiege. Ein Klick füllt den Chat vor – du entscheidest, ob du abschickst.',
      'learning.empty': 'Für die verbundene Arbeitsumgebung gibt es keine Lernpfade.',
      'projects.title': 'Projekte',
      'projects.sub': 'Die Projekte, die {agent} kennt. Ein Klick wählt das Projekt für deine nächsten Anfragen.',
      'projects.empty': 'Keine Projekte gefunden. Stimmt der Pfad zur {agent}-Arbeitsumgebung in config.json?',
      'projects.error': 'Projekte konnten nicht gelesen werden: {err}',
      'projects.none_selected': 'Kein Projekt gewählt',
      'projects.selected': 'Projekt: {name}',
      'explorer.title': '📁 Datei-Explorer',
      'explorer.choose': 'Ordner …',
      'explorer.up': '↑',
      'explorer.hide': '⟩',
      'explorer.empty': 'Leerer Ordner.',
      'explorer.error': 'Ordner konnte nicht gelesen werden: {err}',
      'explorer.items': 'Elemente',
      'chat.placeholder': 'Beschreib einfach, was du brauchst … (Dateien, Ordner oder Links hierher ziehen)',
      'chat.send': 'Senden (Enter)',
      'chat.stop': 'Stopp',
      
      // Skills
      'skill.ticket.label': 'Ticket erstellen',
      'skill.ticket.phrase': 'Erstell mir ein Ticket für {P}: ',
      'skill.update_ticket.label': 'Ticket aktualisieren',
      'skill.update_ticket.phrase': 'Aktualisiere in {P} das Ticket … : ',
      'skill.status.label': 'Statusbericht',
      'skill.status.phrase': 'Gib mir einen Statusbericht für {P}.',
      'skill.vcycle.label': 'V-Zyklus-Status',
      'skill.vcycle.phrase': 'Zeig mir den V-Zyklus-Status für {P}.',
      'skill.ask.label': 'Frage zum Projekt',
      'skill.ask.phrase': 'Erklär mir {P}.',
      'skill.doc.label': 'Dokument schreiben',
      'skill.doc.phrase': 'Schreib ein Dokument für {P} über ',
      'skill.review.label': 'Dokument reviewen',
      'skill.review.phrase': 'Bitte reviewe dieses Dokument: ',
      'skill.excel.label': 'Excel erstellen',
      'skill.excel.phrase': 'Erstell mir eine Excel-Arbeitsmappe für {P}: ',
      'skill.review_excel.label': 'Excel prüfen',
      'skill.review_excel.phrase': 'Prüf bitte diese Excel-Datei: ',
      'skill.add_project.label': 'Projekt hinzufügen',
      'skill.add_project.phrase': 'Füg ein neues Projekt hinzu.',
      'skill.setup.label': 'Einrichtung',
      'skill.setup.phrase': 'Hilf mir bei der Einrichtung.',

      // Lernpfade
      'lp.status.title': 'Mein erster Statusbericht',
      'lp.status.sub': 'Nur lesend – ändert nichts. Der sicherste Einstieg.',
      'lp.status.phrase': 'Gib mir einen Statusbericht für {P}. Erklär mir kurz, woher die Zahlen kommen.',
      'lp.ticket.title': 'Ein Ticket anlegen',
      'lp.ticket.sub': 'Du siehst den Entwurf zuerst und gibst ihn dann frei.',
      'lp.ticket.phrase': 'Ich möchte ein Ticket für {P} anlegen. Frag mich Schritt für Schritt, was du dafür brauchst.',
      'lp.review.title': 'Ein Dokument reviewen lassen',
      'lp.review.sub': 'Datei aus dem Explorer in den Chat ziehen – fertig.',
      'lp.review.phrase': 'Bitte reviewe dieses Dokument und sag mir zuerst nur, was dir auffällt: ',

      // Tools (for permissions etc)
      'tool.Bash': 'Befehl ausführen',
      'tool.Write': 'Datei anlegen',
      'tool.Edit': 'Datei ändern',
      'tool.MultiEdit': 'Dateien ändern',
      'tool.Read': 'Datei lesen',
      'tool.Glob': 'Dateien suchen',
      'tool.Grep': 'In Dateien suchen',
      'tool.WebFetch': 'Webseite abrufen',
      'tool.WebSearch': 'Im Web suchen',
      'tool.Agent': 'Hilfsagent starten',
      'tool.Task': 'Hilfsagent starten',
      'tool.Skill': 'Skill ausführen',
      'tool.NotebookEdit': 'Notebook ändern',
      'tool.AskUserQuestion': 'Rückfrage',
      
      // Permissions
      'perm.title': '🔐 Freigabe erforderlich',
      'perm.details': 'Details anzeigen',
      'perm.allow': '✔ Freigeben',
      'perm.allow_always': 'Freigeben & nicht mehr fragen',
      'perm.deny': 'Ablehnen',
      'perm.waiting': 'Wartet auf deine Entscheidung …',
      'perm.allowed': 'Freigegeben ✓',
      'perm.denied': 'Abgelehnt ✕',

      // Chat / Activity
      'turn.done': '✓ Fertig · {s} s',
      'turn.error': '✗ Abgebrochen nach {s} s',

      // File kinds
      'file.folder': 'Ordner',
      'file.file': 'Datei',
      'file.link': 'Link',
    },
    en: {
      'brand.sub': 'Your project assistant – simply explained.',
      'persona.soft': 'Simple',
      'persona.label': 'Persona',
      'model.label': 'Model',
      'status.starting': 'Engine starting …',
      'status.ready': 'Ready',
      'status.busy': '{agent} is working …',
      'status.changing_model': 'Changing model …',
      'status.changing_persona': 'Changing persona …',
      'status.error': 'Error – see terminal',
      'banner.danger': '⚠ Approvals disabled (--dangerously-skip-permissions) – actions will execute without confirmation.',
      'nav.chat': 'Chat',
      'nav.terminal': 'Terminal',
      'nav.learning': 'Learning Paths',
      'nav.projects': 'Projects',
      'nav.explorer': 'Explorer',
      'hint.main': 'Nothing with external impact happens without your approval. You see drafts first.',
      'hint.danger': 'Warning: Approvals are disabled – actions run without confirmation.',
      'hint.explorer': 'Drag a file or folder into the chat – the path will be inserted automatically.',
      'terminal.title': 'Terminal View',
      'terminal.sub': 'Shows live what {agent} is actually doing in the background. Just for watching – no input needed here.',
      'terminal.clear': 'Clear',
      'learning.title': 'Learning Paths',
      'learning.sub': 'Short, guided intros. One click pre-fills the chat – you decide whether to send.',
      'learning.empty': 'There are no learning paths for the connected workspace.',
      'projects.title': 'Projects',
      'projects.sub': 'Projects known to {agent}. A click selects the project for your next requests.',
      'projects.empty': 'No projects found. Is the path to the {agent} workspace correct in config.json?',
      'projects.error': 'Could not read projects: {err}',
      'projects.none_selected': 'No project selected',
      'projects.selected': 'Project: {name}',
      'explorer.title': '📁 File Explorer',
      'explorer.choose': 'Folder …',
      'explorer.up': '↑',
      'explorer.hide': '⟩',
      'explorer.empty': 'Empty folder.',
      'explorer.error': 'Could not read folder: {err}',
      'explorer.items': 'items',
      'chat.placeholder': 'Just describe what you need … (Drag files, folders, or links here)',
      'chat.send': 'Send (Enter)',
      'chat.stop': 'Stop',

      // Skills
      'skill.ticket.label': 'Create ticket',
      'skill.ticket.phrase': 'Create a ticket for {P}: ',
      'skill.update_ticket.label': 'Update ticket',
      'skill.update_ticket.phrase': 'Update the ticket in {P} … : ',
      'skill.status.label': 'Status report',
      'skill.status.phrase': 'Give me a status report for {P}.',
      'skill.vcycle.label': 'V-cycle status',
      'skill.vcycle.phrase': 'Show me the V-cycle status for {P}.',
      'skill.ask.label': 'Question about project',
      'skill.ask.phrase': 'Explain {P} to me.',
      'skill.doc.label': 'Write document',
      'skill.doc.phrase': 'Write a document for {P} about ',
      'skill.review.label': 'Review document',
      'skill.review.phrase': 'Please review this document: ',
      'skill.excel.label': 'Create spreadsheet',
      'skill.excel.phrase': 'Create an Excel workbook for {P}: ',
      'skill.review_excel.label': 'Review spreadsheet',
      'skill.review_excel.phrase': 'Please check this Excel file: ',
      'skill.add_project.label': 'Add project',
      'skill.add_project.phrase': 'Add a new project.',
      'skill.setup.label': 'Setup',
      'skill.setup.phrase': 'Help me with the setup.',

      // Lernpfade
      'lp.status.title': 'My first status report',
      'lp.status.sub': 'Read-only – changes nothing. The safest start.',
      'lp.status.phrase': 'Give me a status report for {P}. Briefly explain where the numbers come from.',
      'lp.ticket.title': 'Create a ticket',
      'lp.ticket.sub': 'You see the draft first and then approve it.',
      'lp.ticket.phrase': 'I want to create a ticket for {P}. Ask me step by step what you need for it.',
      'lp.review.title': 'Have a document reviewed',
      'lp.review.sub': 'Drag a file from the explorer into the chat – done.',
      'lp.review.phrase': 'Please review this document and tell me first just what you notice: ',

      // Tools
      'tool.Bash': 'Run command',
      'tool.Write': 'Create file',
      'tool.Edit': 'Edit file',
      'tool.MultiEdit': 'Edit files',
      'tool.Read': 'Read file',
      'tool.Glob': 'Search files',
      'tool.Grep': 'Search in files',
      'tool.WebFetch': 'Fetch webpage',
      'tool.WebSearch': 'Search the web',
      'tool.Agent': 'Start subagent',
      'tool.Task': 'Start subagent',
      'tool.Skill': 'Run skill',
      'tool.NotebookEdit': 'Edit notebook',
      'tool.AskUserQuestion': 'Question to user',

      // Permissions
      'perm.title': '🔐 Approval required',
      'perm.details': 'Show details',
      'perm.allow': '✔ Approve',
      'perm.allow_always': 'Approve & don\'t ask again',
      'perm.deny': 'Deny',
      'perm.waiting': 'Waiting for your decision …',
      'perm.allowed': 'Approved ✓',
      'perm.denied': 'Denied ✕',

      // Chat / Activity
      'turn.done': '✓ Done · {s} s',
      'turn.error': '✗ Aborted after {s} s',

      // File kinds
      'file.folder': 'Folder',
      'file.file': 'File',
      'file.link': 'Link',
    }
  };

  let currentLang = 'de';

  function t(key, vars = {}) {
    const table = translations[currentLang] || translations.de;
    let text = table[key] || translations.de[key] || key;
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  }

  function setLang(lang) {
    if (translations[lang]) currentLang = lang;
  }

  function getLang() {
    return currentLang;
  }

  window.i18n = { t, setLang, getLang };
})();
