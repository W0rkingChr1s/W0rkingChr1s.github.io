document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const terminalDiv = document.getElementById('terminal');
    const inputLine = document.getElementById('input-line');
    const coffeeButton = document.getElementById('coffee-button');

    const files = {
        'vita': 'vita.txt',
        'impressum': 'impressum.txt'
    };

    const history = [];
    let historyIndex = 0;

    const commands = [
        'ls', 'cat', 'pwd', 'rm -rf /', 'whoami', 'hello', 'matrix', 'joke', 'quote',
        'clear', 'date', 'help', 'echo', 'cal', 'cat impressum', 'cat vita', 'buymeacoffee', 'github'
    ];

    const commandDescriptions = [
        { command: 'ls', description: 'List files' },
        { command: 'cat [file]', description: 'Display file contents' },
        { command: 'pwd', description: 'Show current directory' },
        { command: 'rm -rf /', description: 'An important command' },
        { command: 'whoami', description: 'Display the current user' },
        { command: 'hello', description: 'A special greeting' },
        { command: 'matrix', description: 'Follow the white rabbit' },
        { command: 'joke', description: 'Tell a joke' },
        { command: 'quote', description: 'Display a random quote' },
        { command: 'clear', description: 'Clear the terminal screen' },
        { command: 'date', description: 'Display the current date and time' },
        { command: 'help', description: 'Show this help message' },
        { command: 'echo [text]', description: 'Display text' },
        { command: 'cal', description: 'Display a simple calendar for the current month' },
        { command: 'buymeacoffee', description: 'Show Buy Me a Coffee button' },
        { command: 'github', description: 'List GitHub & RettTechSolutions projects' }
    ];

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = inputField.value.trim();
            if (command) {
                history.push(command);
                historyIndex = history.length;
                executeCommand(command);
                inputField.value = '';
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            autocomplete(inputField.value.trim());
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = history[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                inputField.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                inputField.value = '';
            }
        }
    });

    inputField.addEventListener('focus', () => {
        scrollToBottom(); // Ensure the input field is visible when focused
    });

    // Klick irgendwo ins Terminal fokussiert die Eingabe (übliches Terminal-Verhalten)
    terminalDiv.addEventListener('click', () => {
        if (!window.getSelection().toString()) {
            inputField.focus();
        }
    });

    function autocomplete(input) {
        if (!input) return;
        const potentialCommands = commands.concat(Object.keys(files));
        const matches = [...new Set(potentialCommands.filter(cmd => cmd.startsWith(input)))];
        if (matches.length === 1) {
            inputField.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            const echo = document.createElement('div');
            echo.textContent = `guest@zeitler.tech:~$ ${input}`;
            outputDiv.appendChild(echo);
            const list = document.createElement('div');
            list.textContent = matches.join('   ');
            outputDiv.appendChild(list);
            // Auf das längste gemeinsame Präfix vervollständigen
            inputField.value = commonPrefix(matches);
            scrollToBottom();
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    function commonPrefix(strings) {
        if (!strings.length) return '';
        let prefix = strings[0];
        for (const str of strings) {
            while (!str.startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
            }
        }
        return prefix;
    }

    function executeCommand(command) {
        const output = document.createElement('div');
        output.textContent = `guest@zeitler.tech:~$ ${command}`;
        outputDiv.appendChild(output);
        const response = document.createElement('div');

        if (command === 'matrix') {
            // Hide the input line and clear terminal
            inputLine.style.display = 'none';
            clearTerminal();

            const matrixText = [
                { text: 'Wake up, Neo...', delay: 2000 },
                { text: 'The Matrix has you...', delay: 3000 },
                { text: 'Follow the white Rabbit.', delay: 2000 },
                { text: 'Knock, knock, Neo.', delay: 5000 }
            ];
            simulateTyping(matrixText, 0);
        } else if (command === 'github') {
            const sources = [
                { title: 'w0rkingchr1s', url: 'https://api.github.com/users/w0rkingchr1s/repos?per_page=100&sort=updated' },
                { title: 'RettTechSolutions', url: 'https://api.github.com/orgs/RettTechSolutions/repos?per_page=100&sort=updated' }
            ];
            Promise.all(sources.map(src =>
                fetch(src.url)
                    .then(res => (res.ok ? res.json() : []))
                    .catch(() => [])
                    .then(data => ({ title: src.title, data: Array.isArray(data) ? data : [] }))
            )).then(results => {
                let html = '';
                results.forEach(({ title, data }) => {
                    const repos = data
                        .filter(repo => !repo.fork && !repo.archived)
                        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                    if (!repos.length) return;
                    html += `<span class="repo-group">${escapeHtml(title)}:</span><br>`;
                    repos.forEach(repo => {
                        html += `<a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a>`;
                        if (repo.description) {
                            html += ` <span class="repo-desc">- ${escapeHtml(repo.description)}</span>`;
                        }
                        html += '<br>';
                    });
                    html += '<br>';
                });
                response.innerHTML = html || 'No public repositories found.';
                outputDiv.appendChild(response);
                scrollToBottom();
            }).catch(() => {
                response.textContent = 'Error fetching GitHub repositories';
                outputDiv.appendChild(response);
                scrollToBottom();
            });
        } else {
            outputDiv.appendChild(response);
            if (command === 'ls') {
                response.innerHTML = '18/07/2023  04:38 PM   6360  vita<br>' +
                    '18/07/2023  01:17 PM   10300 impressum';
                scrollToBottom();
            } else if (command === 'cat') {
                response.textContent = 'Purr...';
                scrollToBottom();
            } else if (command.startsWith('cat ')) {
                const fileName = command.split(' ')[1];
                if (files[fileName]) {
                    fetch(files[fileName])
                        .then(response => response.text())
                        .then(data => {
                            const fileContent = document.createElement('div');
                            fileContent.textContent = data;
                            outputDiv.appendChild(fileContent);
                            scrollToBottom();
                        })
                        .catch(error => {
                            const errorMsg = document.createElement('div');
                            errorMsg.textContent = `cat: ${fileName}: Error loading file`;
                            outputDiv.appendChild(errorMsg);
                            scrollToBottom();
                        });
                } else {
                    response.textContent = `cat: ${fileName}: No such file or directory`;
                    scrollToBottom();
                }
            } else if (command.startsWith('echo ')) {
                const echoText = command.substring(5);
                response.textContent = echoText;
                scrollToBottom();
            } else {
                switch (command) {
                    case 'pwd':
                        response.textContent = '/root/';
                        break;
                    case 'rm -rf /':
                        response.textContent = "I'm sorry, Dave. I'm afraid I can't do that.";
                        break;
                    case 'whoami':
                        response.textContent = 'hooman';
                        break;
                    case 'hello':
                        response.textContent = 'General Kenobi. You are a bold one. Kill him!';
                        break;
                    case 'joke':
                        response.innerHTML = 
                            'Knock Knock? <br>' +
                            'Who\'s there?<br>' +
                            '\'or 1=1; /* <br>' +
                            '&lt;door opens&gt;';
                        break;
                    case 'quote':
                        const quotes = [
                            '“The only way to do great work is to love what you do.” – Steve Jobs',
                            '“Life is what happens when you’re busy making other plans.” – John Lennon',
                            '“The purpose of our lives is to be happy.” – Dalai Lama',
                            '"With great power there must also come – great responsibility" - Spiderman',
                            '"Now I am become Death, the destroyer of worlds" - J. Robert Oppenheimer',
                            '"Check, please." - Lone Starr & Barf, Spaceballs',
                            '"These aren\'t the droids you\'re looking for." - Obi-Wan, Star Wars'
                        ];
                        response.textContent = quotes[Math.floor(Math.random() * quotes.length)];
                        break;
                    case 'clear':
                        clearTerminal();
                        return; // Exit the function early since we've cleared the screen
                    case 'date':
                        response.textContent = new Date().toString();
                        break;
                    case 'help':
                        response.innerHTML = 'Available commands:<br>';
                        commandDescriptions.sort((a, b) => a.command.localeCompare(b.command));
                        commandDescriptions.forEach(cmd => {
                            response.innerHTML += `${cmd.command} - ${cmd.description}<br>`;
                        });
                        break;
                    case 'cal':
                        response.textContent = getCalendar();
                        break;
                    case 'buymeacoffee':
                        response.innerHTML = getCoffeeArt();
                        if (coffeeButton) {
                            coffeeButton.style.display = 'block';
                        }
                        scrollToBottom(); // Ensure the terminal scrolls to show the new content
                        break;
                    default:
                        response.textContent = `${command}: command not found`;
                }
                scrollToBottom();
            }
        }
    }

    function scrollToBottom() {
        terminalDiv.scrollTop = terminalDiv.scrollHeight;
    }

    function clearTerminal() {
        outputDiv.innerHTML = '';
    }

    function simulateTyping(textArray, index) {
        if (index < textArray.length) {
            typeText(textArray[index].text, 0, () => {
                setTimeout(() => {
                    clearTerminal();
                    simulateTyping(textArray, index + 1);
                }, textArray[index].delay);
            });
        } else {
            // Show the input line again and clear terminal
            setTimeout(() => {
                clearTerminal();
                inputLine.style.display = 'flex';
                scrollToBottom();
            }, textArray[index - 1].delay);
        }
    }

    function typeText(text, charIndex, callback) {
        if (charIndex < text.length) {
            outputDiv.innerHTML += text.charAt(charIndex);
            scrollToBottom();
            setTimeout(() => {
                typeText(text, charIndex + 1, callback);
            }, 100); // Adjust typing speed here
        } else {
            callback();
        }
    }

    function getCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const days = new Date(year, month + 1, 0).getDate();

        let calendar = `\n   ${now.toLocaleString('default', { month: 'long' })} ${year}\n`;
        calendar += 'Su Mo Tu We Th Fr Sa\n';

        const firstDay = new Date(year, month, 1).getDay();
        for (let i = 0; i < firstDay; i++) {
            calendar += '   ';
        }

        for (let day = 1; day <= days; day++) {
            calendar += (day < 10 ? ' ' : '') + day + ' ';
            if ((day + firstDay) % 7 === 0) {
                calendar += '\n';
            }
        }

        return calendar;
    }

    function getCoffeeArt() {
        return `
             ) ) )
            ( ( (
             ) ) )
          .........
          |       |]
          \\       /
           \`-----'\`
<a href="https://buymeacoffee.com/w0rkingchr1s" target="_blank">     ┏━━━━━━━━━━━━━━━━━━━━┓<br>     ┃ ⛾ Buy me a Coffee ┃<br>     ┗━━━━━━━━━━━━━━━━━━━━┛</a>
        `;
    }

    function showWelcome() {
        const now = new Date();

        // "Uptime" als Gag: laeuft seit dem Geburtsdatum (09.09.1993)
        const birth = new Date(1993, 8, 9);
        const diffMs = now - birth;
        const days = Math.floor(diffMs / 86400000);
        const hours = Math.floor((diffMs % 86400000) / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        const uptime = `${days} days, ${hours} hours, ${mins} mins`;

        // ASCII-Terminal-Logo (links)
        const W = 15;
        const bar = '─'.repeat(W + 2);
        const box = s => `│ ${String(s).padEnd(W)} │`;
        const logo = [
            `╭${bar}╮`,
            box(' ●  ●  ●'),
            `├${bar}┤`,
            box(''),
            box('  >_ guest'),
            box('  zeitler.tech'),
            box(''),
            `╰${bar}╯`
        ];
        const logoW = W + 4;

        // System-Info (rechts)
        const info = [
            { title: 'guest@zeitler.tech' },
            { sep: true },
            { k: 'OS', v: 'zeitler.tech GNU/Linux x86_64' },
            { k: 'Host', v: 'Christoph Zeitler' },
            { k: 'Kernel', v: '6.8.0-60-generic' },
            { k: 'Uptime', v: uptime },
            { k: 'Shell', v: 'bash 5.2.15' },
            { k: 'Terminal', v: 'zeitler.tech-web' },
            { k: 'Role', v: 'IT-Systemadministrator & Consultant' },
            { k: 'Stack', v: 'AD · Exchange · M365 · Azure · Linux' },
            { k: 'Certs', v: 'ITIL v4' }
        ];
        const infoHtml = info.map(line => {
            if (line.title) return `<span class="nf-title">${escapeHtml(line.title)}</span>`;
            if (line.sep) return `<span class="nf-sep">${'-'.repeat(18)}</span>`;
            return `<span class="nf-key">${line.k}:</span> <span class="nf-val">${escapeHtml(line.v)}</span>`;
        });

        const rows = Math.max(logo.length, infoHtml.length);
        let html = '';
        for (let i = 0; i < rows; i++) {
            const left = i < logo.length
                ? `<span class="nf-logo">${escapeHtml(logo[i])}</span>`
                : ' '.repeat(logoW);
            const right = i < infoHtml.length ? infoHtml[i] : '';
            html += `${left}  ${right}\n`;
        }

        // Farbpaletten-Zeile (neofetch-Signatur)
        const palette = ['#FF5555', '#50FA7B', '#F1FA8C', '#5FB0FF', '#FF79C6', '#33D6E5', '#F8F8F2'];
        html += `\n${' '.repeat(logoW)}  `;
        html += palette.map(c => `<span style="color:${c}">███</span>`).join('');
        html += '\n';

        const banner = document.createElement('div');
        banner.innerHTML = html;
        outputDiv.appendChild(banner);
        scrollToBottom();
    }

    showWelcome();
});
