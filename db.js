/**
 * db.js - Local Storage Database for Pixel by Maliya Portfolio
 * Handles all data persistence using localStorage
 */

const DB = {
    KEYS: {
        PROJECTS: 'pbm_projects',
        PASSWORD: 'pbm_admin_pass',
    },

    // Default admin password
    DEFAULT_PASSWORD: 'pixelmaliya2025',

    /**
     * Get all projects from localStorage
     */
    getProjects() {
        try {
            const raw = localStorage.getItem(this.KEYS.PROJECTS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('DB.getProjects error:', e);
            return [];
        }
    },

    /**
     * Save a new project
     */
    saveProject(project) {
        const projects = this.getProjects();
        project.id = Date.now().toString();
        project.createdAt = new Date().toISOString();
        projects.unshift(project); // newest first
        localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
        return project;
    },

    /**
     * Delete a project by ID
     */
    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
    },

    /**
     * Get the admin password
     */
    getPassword() {
        return localStorage.getItem(this.KEYS.PASSWORD) || this.DEFAULT_PASSWORD;
    },

    /**
     * Set a new admin password
     */
    setPassword(newPass) {
        localStorage.setItem(this.KEYS.PASSWORD, newPass);
    },

    /**
     * Check if password matches
     */
    checkPassword(input) {
        return input === this.getPassword();
    }
};
