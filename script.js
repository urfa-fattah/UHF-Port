/**
 * UrfaOS Portfolio JavaScript
 * Manages terminal navigation, modals, animations, and hacking features.
 * @author Urfa Hasan Fattah
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const VALID_COMMANDS = [
    'home', 'about', 'skills', 'projects', 'gallery', 'contact',
    'ls', 'cd', 'pwd', 'cat', 'man', 'grep', 'nmap', 'help',
    'hack', 'exploit', 'backdoor', 'scan', 'keylog', 'stego'
  ];
  const HACKER_ALIASES = ['urfa@ghost', 'urfa@shadow', 'urfa@cipher', 'urfa@phantom'];
  const SECTIONS = ['home', 'about', 'skills', 'projects', 'gallery', 'contact'];

  // Utility Functions
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => context.querySelectorAll(selector);

  /**
   * Plays a click sound effect if available.
   */
  function playSound() {
    try {
      new Audio('assets/click.mp3').play().catch(() => {});
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  // Terminal Class
  class Terminal {
    constructor() {
      this.input = $('.terminal-input');
      this.historyEl = $('.command-history');
      this.promptEl = $('.terminal-prompt');
      this.autocompleteEl = $('.autocomplete-suggestions');
      this.clockEl = $('.terminal-clock');
      this.history = [];
      this.historyIndex = -1;
      this.commands = this.getCommandHandlers();

      if (!this.input || !this.historyEl || !this.promptEl || !this.autocompleteEl || !this.clockEl) {
        console.error('Terminal elements not found');
        return;
      }

      this.bindEvents();
      this.initClock();
      this.updatePrompt();
      this.initTyped();
    }

    bindEvents() {
      this.input.addEventListener('input', () => this.handleInput());
      this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    initClock() {
      const updateClock = () => {
        if (this.clockEl.offsetParent) {
          this.clockEl.textContent = new Date().toLocaleTimeString();
        }
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    updatePrompt() {
      this.promptEl.textContent = `${HACKER_ALIASES[Math.floor(Math.random() * HACKER_ALIASES.length)]}:~$`;
    }

    handleInput() {
      const value = this.input.value.trim().toLowerCase();
      this.autocompleteEl.innerHTML = value
        ? VALID_COMMANDS
            .filter(cmd => cmd.startsWith(value))
            .map(cmd => `<div>${cmd}</div>`)
            .join('')
        : '';
    }

    handleKeydown(e) {
      if (e.key === 'Enter') {
        const command = this.input.value.trim().toLowerCase();
        if (command) {
          this.history.push(command);
          this.historyIndex = this.history.length;
          this.historyEl.innerHTML += `<p><span style="color: var(--primary-color);">${this.promptEl.textContent}</span> ${command}</p>`;
          this.historyEl.scrollTop = this.historyEl.scrollHeight;

          this.executeCommand(command);
          this.input.value = '';
          this.autocompleteEl.innerHTML = '';
          this.updatePrompt();
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.input.value = '';
          this.historyIndex = this.history.length;
        }
      }
    }

    getCommandHandlers() {
      return {
        home: () => this.switchSection('home'),
        about: () => this.switchSection('about'),
        skills: () => this.switchSection('skills'),
        projects: () => this.switchSection('projects'),
        gallery: () => this.switchSection('gallery'),
        contact: () => this.switchSection('contact'),
        ls: () => `<span style="color: var(--highlight-color);">home about skills projects gallery contact</span>`,
        cd: (arg) => {
          if (SECTIONS.includes(arg)) {
            this.switchSection(arg);
            return '';
          }
          return `<span style="color: var(--error-color);">bash: cd: ${arg || ''}: No such directory</span>`;
        },
        pwd: () => '/home/urfa/portfolio',
        cat: (arg) => {
          if (arg === 'about') return 'Urfa Hasan Fattah - White Hat Hacker & Web Developer';
          return `<span style="color: var(--error-color);">cat: ${arg || ''}: No such file</span>`;
        },
        man: (arg) => {
          if (VALID_COMMANDS.includes(arg)) return `Manual for ${arg}: Navigates to ${arg} section or performs action.`;
          return `<span style="color: var(--error-color);">man: ${arg || ''}: No manual entry</span>`;
        },
        grep: (arg) => {
          if (arg === 'hacker') return 'White Hat Hacker: Securing the web ethically.';
          return `<span style="color: var(--error-color);">grep: ${arg || ''}: No matches found</span>`;
        },
        nmap: () => `<span style="color: var(--highlight-color);">Starting Nmap 7.93 ( https://nmap.org )<br>PORT   STATE SERVICE<br>80/tcp open  http</span>`,
        help: () => `Available commands: <span style="color: var(--highlight-color);">${VALID_COMMANDS.join(', ')}</span>`,
        hack: () => ModalManager.openModal('#hack-game-modal'),
        exploit: () => ModalManager.openModal('#exploit-toolkit'),
        backdoor: () => ModalManager.openModal('#backdoor'),
        scan: () => `<span style="color: var(--highlight-color);">Scanning 10.0.0.1...<br>22/tcp open  ssh<br>80/tcp open  http</span>`,
        keylog: () => ModalManager.openModal('#keylogger'),
        stego: () => 'Hint: Check Gallery images for hidden data with stegsolve!'
      };
    }

    executeCommand(command) {
      const [cmd, arg] = command.split(' ');
      const handler = this.commands[cmd];
      let output = '';

      if (handler) {
        output = handler(arg);
      } else {
        output = `<span style="color: var(--error-color);">bash: ${command}: command not found</span>`;
      }

      if (output && typeof output === 'string') {
        const p = document.createElement('p');
        p.innerHTML = output;
        this.historyEl.appendChild(p);
        this.historyEl.scrollTop = this.historyEl.scrollHeight;
      }

      if (cmd !== 'hack' && cmd !== 'exploit' && cmd !== 'backdoor' && cmd !== 'keylog') {
        playSound();
      }
    }

    switchSection(section) {
      if (!SECTIONS.includes(section)) return;
      $$('.section').forEach(s => s.classList.remove('active'));
      $$('.guide-item').forEach(g => g.classList.remove('active'));
      const sectionEl = $(`#${section}`);
      const guideItem = $(`.guide-item[data-section="${section}"]`);
      if (sectionEl) sectionEl.classList.add('active');
      if (guideItem) guideItem.classList.add('active');
    }

    initTyped() {
      if (typeof Typed !== 'undefined') {
        new Typed('.typing-text', {
          strings: [
            'Welcome to UrfaOS v5.0.',
            'I\'m Urfa, a white hat hacker.',
            'Explore my terminal with commands.'
          ],
          typeSpeed: 30,
          backSpeed: 15,
          loop: true,
          backDelay: 1000
        });
      } else {
        console.warn('Typed.js not loaded');
      }
    }
  }

  // Modal Manager Class
  class ModalManager {
    static modals = $$('.modal');
    static closeButtons = $$('.modal-close');

    static init() {
      this.bindEvents();
      this.bindHackGame();
    }

    static bindEvents() {
      // Preview buttons
      $$('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = $('#project-modal');
          if (modal) {
            modal.querySelector('.modal-image').src = btn.dataset.image;
            modal.querySelector('.modal-text').textContent = btn.dataset.preview;
            this.openModal('#project-modal');
            playSound();
          }
        });
      });

      // Help icon
      $('.help-icon')?.addEventListener('click', () => {
        this.openModal('#help-modal');
        playSound();
      });

      // Close buttons
      this.closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeAllModals();
          $('.terminal-input')?.focus();
          playSound();
        });
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllModals();
          $('.terminal-input')?.focus();
          playSound();
        }
      });
    }

    static bindHackGame() {
      const hackInput = $('.hack-input', $('#hack-game-modal'));
      if (hackInput) {
        hackInput.addEventListener('input', (e) => {
          const result = $('.hack-result', $('#hack-game-modal'));
          if (e.target.value === '1337') {
            result.innerHTML = `<span style="color: var(--highlight-color);">Access granted! Tip: Use strong passwords with 2FA.</span>`;
            playSound();
          } else {
            result.innerHTML = `<span style="color: var(--error-color);">Access denied. Try '1337'.</span>`;
          }
        });
      }
    }

    static openModal(selector) {
      const modal = $(selector);
      if (!modal) return;
      this.closeAllModals();
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      this.trapFocus(modal);
    }

    static closeAllModals() {
      this.modals.forEach(modal => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    static trapFocus(modal) {
      const focusable = modal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      const handleKeydown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      modal.addEventListener('keydown', handleKeydown);
      first.focus();

      // Cleanup
      modal.addEventListener('transitionend', () => {
        if (modal.style.display === 'none') {
          modal.removeEventListener('keydown', handleKeydown);
        }
      }, { once: true });
    }
  }

  // Matrix Rain Class
  class MatrixRain {
    constructor(canvasId) {
      this.canvas = $(`#${canvasId}`);
      if (!this.canvas) {
        console.error('Canvas not found');
        return;
      }
      this.ctx = this.canvas.getContext('2d');
      this.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%';
      this.fontSize = 12;
      this.resize();
      this.drops = Array(Math.floor(this.canvas.width / this.fontSize)).fill(1);
      this.animate();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.drops = Array(Math.floor(this.canvas.width / this.fontSize)).fill(1);
    }

    draw() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = document.body.classList.contains('kali-mode') ? '#663399' : '#00ff00';
      this.ctx.font = `${this.fontSize}px 'Space Mono'`;

      this.drops.forEach((y, i) => {
        const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
        this.ctx.fillText(text, i * this.fontSize, y * this.fontSize);
        this.drops[i] = y * this.fontSize > this.canvas.height && Math.random() > 0.98 ? 0 : y + 1;
      });
    }

    animate() {
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  }

  // Event Handlers
  function initEventHandlers() {
    // Section Guide
    $$('.guide-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section) {
          terminal.switchSection(section);
          terminal.history.push(section);
          terminal.historyEl.innerHTML += `<p><span style="color: var(--primary-color);">${terminal.promptEl.textContent}</span> ${section}</p>`;
          terminal.historyEl.scrollTop = terminal.historyEl.scrollHeight;
        } else if (item.classList.contains('help-btn')) {
          ModalManager.openModal('#help-modal');
          terminal.executeCommand('help');
        }
        playSound();
      });
    });

    // Project Filters
    $$('.filter-btn').forEach(button => {
      button.addEventListener('click', () => {
        $$('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        $$('.project-card').forEach(card => {
          card.style.display = filter === 'all' || card.dataset.category === filter ? 'block' : 'none';
        });
        playSound();
      });
    });

    // Skills
    $$('.skill-node').forEach(node => {
      node.addEventListener('click', () => {
        $$('.skill-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        setTimeout(() => node.classList.remove('active'), 4000);
        const progressBar = node.querySelector('.progress-bar');
        progressBar.style.width = `${node.dataset.progress}%`;
        if (node.dataset.packetSniffer) {
          const sniffer = node.querySelector('.packet-sniffer');
          sniffer.innerHTML = '';
          for (let i = 0; i < 6; i++) {
            setTimeout(() => {
              sniffer.innerHTML += `<p>Packet ${i + 1}: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} -> Port ${Math.floor(Math.random() * 65535)}</p>`;
              sniffer.scrollTop = sniffer.scrollHeight;
            }, i * 400);
          }
        }
        playSound();
      });
    });

    // Timeline
    const timelineObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    $$('.timeline-item').forEach(item => timelineObserver.observe(item));

    // Mode Toggle
    $('.mode-toggle')?.addEventListener('click', () => {
      document.body.classList.toggle('kali-mode');
      $('.mode-toggle').innerHTML = document.body.classList.contains('kali-mode')
        ? '<i class="fas fa-terminal"></i>'
        : '<i class="fas fa-skull"></i>';
      playSound();
    });

    // Firewall Widget
    $('.firewall-widget')?.addEventListener('click', () => {
      const status = $('.firewall-widget .status');
      if (status) {
        status.classList.toggle('active');
        status.classList.toggle('inactive');
        status.textContent = status.classList.contains('active') ? 'Active' : 'Inactive';
        playSound();
      }
    });

    // Decrypt Message
    $('.decrypt-btn')?.addEventListener('click', () => {
      const message = 'Kdfz#311:#Hwklfdo#kdfnlqj#lv#pb#sdvvlrq!';
      const decrypted = message.split('').map(c => {
        if (/[a-zA-Z]/.test(c)) {
          const base = c.toLowerCase() === c ? 97 : 65;
          return String.fromCharCode((c.charCodeAt(0) - base - 3 + 26) % 26 + base);
        }
        return c;
      }).join('');
      $('.decrypted-message').textContent = decrypted;
      playSound();
    });

    // Gallery Decrypt Effect
    $('.gallery-grid')?.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const overlay = item.querySelector('.gallery-overlay');
        if (overlay) {
          overlay.style.animation = 'decrypt 1s forwards';
          setTimeout(() => (overlay.style.animation = ''), 1000);
          playSound();
        }
      }
    });
  }

  // Initialize
  const terminal = new Terminal();
  ModalManager.init();
  new MatrixRain('matrix-bg');
  initEventHandlers();
});