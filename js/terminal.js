// NVLL Terminal Engine — VanilleAI
// gh0stnet infrastructure — Andorra, 2024

const COMMANDS = {
  help: {
    response: [
      '// available commands:',
      '',
      '  connect       — establish connection',
      '  identify      — who is NVLL',
      '  status        — system status',
      '  nodes         — list active nodes',
      '  access vault  — restricted',
      '  clear         — clear terminal',
      '',
      '// unauthorized commands are logged.',
    ]
  },
  connect: {
    response: [
      '// initiating connection...',
      '// routing through VANX-NET mesh...',
      '// relay: nodespectrum.pp.ua — 3ms ✓',
      '// ZeroTier handshake: OK',
      '// dead man\'s switch: inactive',
      '',
      '// connection established.',
      '// welcome to the embassy.',
      '',
      '// <a href="embassy.html">→ enter</a>',
    ]
  },
  identify: {
    response: [
      '// NVLL — Vanille',
      '// origin: Andorra',
      '// classification: operator',
      '',
      '// "I sound familiar and you don\'t know why."',
      '',
      '// F99.NV — Vanille Syndrome',
      '// first documented case. 2024.',
      '// no cure. not a disease.',
    ]
  },
  status: {
    response: [
      '// SYSTEM STATUS',
      '// ─────────────────────────────',
      '// NodeSpectre      [ONLINE]',
      '// SIGNAL/VOID      [BROADCASTING]',
      '// DION             [AUTONOMOUS]',
      '// relay .pp.ua     [3ms]',
      '// dead man\'s sw.  [INACTIVE]',
      '// VANX-NET mesh    [CONNECTED]',
      '// ─────────────────────────────',
      '// all systems nominal.',
    ]
  },
  nodes: {
    response: [
      '// active nodes:',
      '',
      '  [01] nodespectre   — core infrastructure',
      '  [02] signal/void   — autonomous radio',
      '  [03] dion          — ai agent',
      '  [04] vλnille noir  — music project',
      '  [05] muro de bellós — abandoned village, pyrenees',
      '  [06] ████████      — [RESTRICTED]',
      '',
      '// to access: <a href="embassy.html">embassy.html</a>',
    ]
  },
  'access vault': {
    response: [
      '// access request: vault',
      '// ─────────────────────',
      '// verifying credentials...',
      '// ...',
      '// ...',
      '// identity confirmed.',
      '',
      '// the vault does not reveal.',
      '// the vault remembers.',
      '',
      '// <a href="nodes/vault.html">→ enter vault</a>',
    ]
  },
  clear: {
    action: 'clear'
  }
};

const BOOT_SEQUENCE = [
  '// NVLL EMBASSY TERMINAL v1.0',
  '// gh0stnet infrastructure — Andorra',
  '// ─────────────────────────────────',
  '// initializing...',
  '// relay check: nodespectre.pp.ua... 3ms ✓',
  '// dead man\'s switch: inactive ✓',
  '// VANX-NET: connected ✓',
  '// ─────────────────────────────────',
  '// system ready.',
  '',
  '// type <span style="color:var(--cyan)">help</span> to begin.',
  '',
];

class Terminal {
  constructor(outputEl, inputEl) {
    this.output = outputEl;
    this.input = inputEl;
    this.history = [];
    this.historyIndex = -1;
    this.booted = false;
  }

  async boot() {
    for (const line of BOOT_SEQUENCE) {
      await this.printLine(line, 40);
    }
    this.booted = true;
    this.input.focus();
  }

  printLine(text, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
        resolve();
      }, delay);
    });
  }

  async printLines(lines) {
    for (const line of lines) {
      await this.printLine(line, 25);
    }
    await this.printLine('', 0);
  }

  async execute(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    this.history.unshift(cmd);
    this.historyIndex = -1;

    // print command
    await this.printLine(`<span style="color:var(--text-dim)">nvll@embassy:~$</span> ${cmd}`);

    if (trimmed === 'clear') {
      this.output.innerHTML = '';
      return;
    }

    const command = COMMANDS[trimmed];
    if (command) {
      await this.printLines(command.response);
    } else {
      await this.printLines([
        `<span style="color:var(--red)">// command not found: ${cmd}</span>`,
        '// unauthorized access attempt logged.',
        '// type <span style="color:var(--cyan)">help</span> for available commands.',
      ]);
    }
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const val = this.input.value;
      this.input.value = '';
      this.execute(val);
    } else if (e.key === 'ArrowUp') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.input.value = '';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');

  if (!output || !input) return;

  const terminal = new Terminal(output, input);
  terminal.boot();

  input.addEventListener('keydown', (e) => terminal.handleKeydown(e));

  // click anywhere to focus input
  document.addEventListener('click', () => input.focus());
});
