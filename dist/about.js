"use strict";
// ============================================
// TYPESCRIPT LEARNING: CLASSES & INHERITANCE
// ============================================
// This file demonstrates Object-Oriented Programming concepts in TypeScript
// ABSTRACT CLASS: Cannot be instantiated directly, must be extended
// Used as a base class for other classes
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.id = Math.floor(Math.random() * 10000);
    }
    // REGULAR METHOD: Can be used by all subclasses
    introduce() {
        return `Hi, I'm ${this.name}, ${this.age} years old.`;
    }
    // GETTER: Access like a property (person.displayName)
    get displayName() {
        return this.name.toUpperCase();
    }
    // SETTER: Set like a property (person.displayName = "John")
    set displayName(newName) {
        if (newName.length > 0) {
            this.name = newName;
        }
    }
}
// CLASS INHERITANCE: Developer extends Person
class Developer extends Person {
    // CONSTRUCTOR with additional parameters
    constructor(name, age, skills, experience) {
        // SUPER: Call the parent class constructor
        super(name, age);
        this.skills = skills;
        this.yearsOfExperience = experience;
    }
    // IMPLEMENTING ABSTRACT METHOD
    getRole() {
        return "Software Developer";
    }
    // METHOD OVERRIDE: Extending parent's method
    introduce() {
        // Call parent's method with super
        const baseIntro = super.introduce();
        return `${baseIntro} I'm a ${this.getRole()} with ${this.yearsOfExperience} years of experience.`;
    }
    // CUSTOM METHOD
    showSkills() {
        return `Skills: ${this.skills.join(', ')}`;
    }
    // METHOD WITH OPTIONAL PARAMETER
    addSkill(skill, notify = true) {
        this.skills.push(skill);
        if (notify) {
            console.log(`Added new skill: ${skill}`);
        }
    }
}
// ANOTHER SUBCLASS
class Designer extends Person {
    constructor(name, age, tools, portfolio) {
        super(name, age);
        this.tools = tools;
        this.portfolio = portfolio;
    }
    getRole() {
        return "UI/UX Designer";
    }
    introduce() {
        const baseIntro = super.introduce();
        return `${baseIntro} I'm a ${this.getRole()}. Check out my portfolio: ${this.portfolio}`;
    }
    showTools() {
        return `I use: ${this.tools.join(', ')}`;
    }
}
// GENERIC FUNCTION: Works with any type
// <T> means this function can work with any type you specify
function displayInfo(person) {
    const infoDiv = document.getElementById('personInfo');
    if (!infoDiv)
        return;
    const info = document.createElement('div');
    info.className = 'person-card';
    info.innerHTML = `
    <h3>${person.displayName} (ID: ${person.id})</h3>
    <p>${person.introduce()}</p>
    <p><strong>Role:</strong> ${person.getRole()}</p>
  `;
    // TYPE NARROWING: Check specific type
    if (person instanceof Developer) {
        info.innerHTML += `<p>${person.showSkills()}</p>`;
    }
    else if (person instanceof Designer) {
        info.innerHTML += `<p>${person.showTools()}</p>`;
    }
    infoDiv.appendChild(info);
}
// TYPE GUARD FUNCTION: Checks if value is of specific type
function isDeveloper(member) {
    return member.type === 'developer';
}
// INITIALIZE DEMO
document.addEventListener('DOMContentLoaded', () => {
    // Create sample persons
    const dev1 = new Developer("Alice Johnson", 28, ["TypeScript", "React", "Node.js"], 5);
    const dev2 = new Developer("Bob Smith", 32, ["Python", "Django", "PostgreSQL"], 8);
    const designer1 = new Designer("Carol White", 26, ["Figma", "Adobe XD", "Sketch"], "caroldesigns.com");
    // Display them
    displayInfo(dev1);
    displayInfo(dev2);
    displayInfo(designer1);
    // Demonstrate setter
    dev1.displayName = "Alice 'TypeScript Expert' Johnson";
    // Add interactive demo
    setupInteractiveDemo();
});
function setupInteractiveDemo() {
    const form = document.getElementById('createPersonForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('personName');
            const ageInput = document.getElementById('personAge');
            const typeSelect = document.getElementById('personType');
            const skillsInput = document.getElementById('personSkills');
            const name = nameInput.value.trim();
            const age = parseInt(ageInput.value);
            const type = typeSelect.value;
            const skills = skillsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            if (name && age && skills.length > 0) {
                let person;
                // Create the appropriate type based on selection
                if (type === 'developer') {
                    person = new Developer(name, age, skills, 1);
                }
                else {
                    person = new Designer(name, age, skills, 'portfolio.com');
                }
                displayInfo(person);
                form.reset();
            }
        });
    }
    // Clear button
    const clearBtn = document.getElementById('clearPersons');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const infoDiv = document.getElementById('personInfo');
            if (infoDiv) {
                infoDiv.innerHTML = '<p class="info-text">Add team members using the form above!</p>';
            }
        });
    }
}
//# sourceMappingURL=about.js.map