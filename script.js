document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const terminalDiv = document.getElementById('terminal');
    const inputLine = document.getElementById('input-line');

    const files = {
        'vita': 'vita.txt',
        'impressum': 'impressum.txt'
    };

    const commands = [
        'ls', 'cat', 'pwd', 'rm -rf /', 'whoami', 'hello', 'matrix', 'joke', 'quote',
        'clear', 'date', 'help', 'echo', 'cal', 'cat impressum', 'cat vita'
    ];

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = inputField.value.trim();
            if (command) {
                executeCommand(command);
                inputField.value = '';
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            autocomplete(inputField.value.trim());
        }
    });

    function autocomplete(input) {
        const potentialCommands = commands.concat(Object.keys(files));
        const matches = potentialCommands.filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            inputField.value = matches[0] + ' ';
        }
    }

    function executeCommand(command) {
        const output = document.createElement('div');
        output.textContent = `root@WorldWideWeb:~$ ${command}`;
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
        } else {
            outputDiv.appendChild(response);
            if (command === 'ls') {
                response.innerHTML = '18/07/2023  04:38 PM   6360  vita<br>' +
                    '18/07/2023  01:17 PM   10300 impressum';
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
                        response.textContent = 'root';
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
                        response.innerHTML = 'Available commands:<br>' +
                            'ls - List files<br>' +
                            'cat [file] - Display file contents<br>' +
                            'pwd - Show current directory<br>' +
                            'rm -rf / - An important command<br>' +
                            'whoami - Display the current user<br>' +
                            'hello - A special greeting<br>' +
                            'matrix - Follow the white rabbit<br>' +
                            'joke - Tell a joke<br>' +
                            'quote - Display a random quote<br>' +
                            'clear - Clear the terminal screen<br>' +
                            'date - Display the current date and time<br>' +
                            'help - Show this help message<br>' +
                            'echo [text] - Display text<br>' +
                            'cal - Display a simple calendar for the current month';
                        break;
                    case 'cal':
                        response.textContent = getCalendar();
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
});
