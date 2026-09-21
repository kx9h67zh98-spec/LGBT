/* FitHealth Data Service */

const FitHealthData = {

    /* Health */

    saveHealthProfile: function (profile) {

        localStorage.setItem(
            "fithealthHealthProfile",
            JSON.stringify(profile)
        );

    },


    getHealthProfile: function () {

        const stored =
            localStorage.getItem(
                "fithealthHealthProfile"
            );


        if (!stored) {
            return null;
        }


        try {

            return JSON.parse(stored);

        } catch (error) {

            console.error(
                "Unable to load health profile:",
                error
            );

            return null;

        }

    },


    /* Meals */

    getMealEntries: function () {

        const stored =
            localStorage.getItem(
                "fithealthMealEntries"
            );


        if (!stored) {
            return [];
        }


        try {

            return JSON.parse(stored);

        } catch (error) {

            console.error(
                "Unable to load meal entries:",
                error
            );

            return [];

        }

    },


    saveMealEntries: function (entries) {

        localStorage.setItem(
            "fithealthMealEntries",
            JSON.stringify(entries)
        );

    },


    addMealEntry: function (entry) {

        const entries =
            this.getMealEntries();


        entries.push(entry);


        this.saveMealEntries(entries);

    },


    updateMealEntry: function (updatedEntry) {

        const entries =
            this.getMealEntries();


        const updated =
            entries.map(

                function (entry) {

                    if (
                        entry.id ===
                        updatedEntry.id
                    ) {

                        return updatedEntry;

                    }

                    return entry;

                }

            );


        this.saveMealEntries(updated);

    },


    deleteMealEntry: function (id) {

        const entries =
            this.getMealEntries();


        const updated =
            entries.filter(

                function (entry) {

                    return entry.id !== id;

                }

            );


        this.saveMealEntries(updated);

    },


    getMealEntryById: function (id) {

        return this
            .getMealEntries()
            .find(

                function (entry) {

                    return entry.id === id;

                }

            );

    },


    getMealEntriesByDate: function (date) {

        return this
            .getMealEntries()
            .filter(

                function (entry) {

                    return entry.date === date;

                }

            );

    },


    /* Workout Draft */

    getWorkoutDraft: function () {

        const stored =
            localStorage.getItem(
                "fithealthWorkoutDraft"
            );


        if (!stored) {
            return [];
        }


        try {

            return JSON.parse(stored);

        } catch (error) {

            console.error(
                "Unable to load workout draft:",
                error
            );

            return [];

        }

    },


    saveWorkoutDraft: function (entries) {

        localStorage.setItem(
            "fithealthWorkoutDraft",
            JSON.stringify(entries)
        );

    },


    addWorkoutDraftEntry: function (entry) {

        const entries =
            this.getWorkoutDraft();


        entries.push(entry);


        this.saveWorkoutDraft(entries);

    },


    updateWorkoutDraftEntry: function (updatedEntry) {

        const entries =
            this.getWorkoutDraft();


        const updated =
            entries.map(

                function (entry) {

                    if (
                        entry.id ===
                        updatedEntry.id
                    ) {

                        return updatedEntry;

                    }

                    return entry;

                }

            );


        this.saveWorkoutDraft(updated);

    },


    deleteWorkoutDraftEntry: function (id) {

        const entries =
            this.getWorkoutDraft();


        const updated =
            entries.filter(

                function (entry) {

                    return entry.id !== id;

                }

            );


        this.saveWorkoutDraft(updated);

    },


    getWorkoutDraftByDate: function (date) {

        return this
            .getWorkoutDraft()
            .filter(

                function (entry) {

                    return entry.date === date;

                }

            );

    }

};
