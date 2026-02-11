// Storage utility for JR NAGARA Online Test Platform
// Provides persistent storage using Supabase backend

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://mpezezekhmbzggsckjdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZXplemVraG1iemdnc2NramRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDM4NzMsImV4cCI6MjA4NjM3OTg3M30.Tf1s_aJ3CFi7HQpCHsSVySvjHb5FamZaxAyGOZNMKH0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Global storage object
window.JRStorage = {
    // SETTINGS - Portal customization
    async getSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching settings:', error);
                return {};
            }
            
            if (!data) {
                // Initialize default settings if not found
                return {
                    portal_name: 'JR NAGARA ONLINE TEST',
                    portal_short_name: 'JR NAGARA',
                    portal_logo: 'https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg',
                    name: 'JR NAGARA ONLINE TEST',
                    shortName: 'JR NAGARA',
                    logo: 'https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg',
                    registration_open: true,
                    results_open: true
                };
            }
            
            return {
                ...data,
                name: data.portal_name,
                shortName: data.portal_short_name,
                logo: data.portal_logo
            };
        } catch (err) {
            console.error('Error in getSettings:', err);
            return {};
        }
    },

    async setSetting(key, value) {
        try {
            const settings = await this.getSettings();
            const updateData = {
                ...settings,
                [key]: value,
                updated_at: new Date().toISOString()
            };

            // Check if settings record exists
            const { data: existing } = await supabase
                .from('settings')
                .select('id')
                .single();

            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('settings')
                    .update(updateData)
                    .eq('id', existing.id);
                
                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from('settings')
                    .insert([{ ...updateData, id: 1 }]);
                
                if (error) throw error;
            }
        } catch (err) {
            console.error('Error setting:', err);
        }
    },

    // TESTS
    async getTests() {
        try {
            const { data, error } = await supabase
                .from('tests')
                .select('*');
            
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching tests:', err);
            return [];
        }
    },

    async saveTest(test) {
        try {
            const { id, ...testData } = test;
            
            const existing = await supabase
                .from('tests')
                .select('id')
                .eq('id', test.id)
                .single();

            if (existing.data) {
                // Update
                const { error } = await supabase
                    .from('tests')
                    .update({ ...testData, updated_at: new Date().toISOString() })
                    .eq('id', test.id);
                
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('tests')
                    .insert([{ ...test, created_at: new Date().toISOString() }]);
                
                if (error) throw error;
            }
        } catch (err) {
            console.error('Error saving test:', err);
            throw err;
        }
    },

    async deleteTest(testId) {
        try {
            const { error } = await supabase
                .from('tests')
                .delete()
                .eq('id', testId);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting test:', err);
        }
    },

    // STUDENTS
    async getStudents() {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*');
            
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching students:', err);
            return [];
        }
    },

    async saveStudent(student) {
        try {
            const existing = await supabase
                .from('students')
                .select('id')
                .eq('id', student.id)
                .single();

            if (existing.data) {
                // Update
                const { error } = await supabase
                    .from('students')
                    .update({ ...student, updated_at: new Date().toISOString() })
                    .eq('id', student.id);
                
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('students')
                    .insert([{ ...student, created_at: new Date().toISOString() }]);
                
                if (error) throw error;
            }
        } catch (err) {
            console.error('Error saving student:', err);
            throw err;
        }
    },

    async deleteStudent(regNumber) {
        try {
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('regNumber', regNumber);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting student:', err);
        }
    },

    // RESULTS
    async getResults() {
        try {
            const { data, error } = await supabase
                .from('results')
                .select('*');
            
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching results:', err);
            return [];
        }
    },

    async saveResult(result) {
        try {
            const { error } = await supabase
                .from('results')
                .insert([{ ...result, created_at: new Date().toISOString() }]);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error saving result:', err);
            throw err;
        }
    },

    async update(table, id, data) {
        try {
            const { error } = await supabase
                .from(table)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('_id', id);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error updating record:', err);
        }
    },

    async delete(table, id) {
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('_id', id);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    },

    // LIVE SESSIONS
    async getLiveSessions() {
        try {
            const { data, error } = await supabase
                .from('live_sessions')
                .select('*');
            
            if (error) throw error;
            
            const sessions = {};
            (data || []).forEach(session => {
                sessions[session.id] = session;
            });
            return sessions;
        } catch (err) {
            console.error('Error fetching live sessions:', err);
            return {};
        }
    },

    async updateSession(sessionId, sessionData) {
        try {
            const { error } = await supabase
                .from('live_sessions')
                .update({ ...sessionData, updated_at: new Date().toISOString() })
                .eq('id', sessionId);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error updating session:', err);
        }
    },

    // MESSAGING
    async sendMessage(studentId, message) {
        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    student_id: studentId,
                    message: message,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
        } catch (err) {
            console.error('Error sending message:', err);
        }
    },

    // UTILITY: Initialize database tables (if needed)
    async initializeTables() {
        try {
            // This would typically be done in Supabase SQL editor
            // But we'll attempt to create if they don't exist
            console.log('Database tables should be initialized in Supabase console');
        } catch (err) {
            console.error('Error initializing tables:', err);
        }
    }
};

console.log('JRStorage initialized - persistent storage ready');
