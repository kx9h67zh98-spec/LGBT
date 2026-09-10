/* Exercises */

const exercises = {


    /* Chest */

    chest: [

        {
            name: "Push Up",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",

            instructions: [
                "Place your hands slightly wider than shoulder width.",
                "Keep your body in a straight line from head to heels.",
                "Lower your chest toward the floor.",
                "Push through your palms to return to the starting position."
            ]
        },


        {
            name: "Machine Chest Press",

            equipment: "Chest Press Machine",

            difficulty: "Beginner",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Adjust the seat so the handles are around chest level.",
                "Keep your back against the pad.",
                "Press the handles forward.",
                "Slowly return to the starting position."
            ]
        },


        {
            name: "Barbell Bench Press",

            equipment: "Barbell + Flat Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Lie flat on the bench with your feet firmly on the floor.",
                "Grip the bar slightly wider than shoulder width.",
                "Unrack the bar and position it above your chest.",
                "Lower the bar under control toward the middle of your chest.",
                "Press the bar upward until your arms are extended."
            ]
        },


        {
            name: "Dumbbell Bench Press",

            equipment: "Dumbbells + Flat Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Lie on a flat bench holding a dumbbell in each hand.",
                "Position the dumbbells beside your chest.",
                "Press both dumbbells upward.",
                "Lower them slowly until you feel a comfortable stretch."
            ]
        },


        {
            name: "Incline Dumbbell Press",

            equipment: "Dumbbells + Adjustable Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Upper Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Set the bench to an incline position.",
                "Hold a dumbbell in each hand.",
                "Position the dumbbells beside your upper chest.",
                "Press the dumbbells upward.",
                "Lower them under control."
            ]
        },


        {
            name: "Cable Crossover",

            equipment: "Cable Machine",

            difficulty: "Intermediate",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Anterior Deltoids"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand between two cable pulleys.",
                "Hold one handle in each hand.",
                "Keep a slight bend in your elbows.",
                "Bring your hands together in front of your chest.",
                "Slowly return to the starting position."
            ]
        },


        {
            name: "Chest Dip",

            equipment: "Dip Station",

            difficulty: "Intermediate",

            primaryMuscle: "Chest",

            secondaryMuscles: [
                "Triceps",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Grip the parallel bars.",
                "Lean your torso slightly forward.",
                "Lower your body by bending your elbows.",
                "Stop at a comfortable depth.",
                "Push yourself back to the starting position."
            ]
        }

    ],



    /* Shoulders */

    shoulders: [

        {
            name: "Dumbbell Shoulder Press",

            equipment: "Dumbbells + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Shoulders",

            secondaryMuscles: [
                "Triceps"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Sit upright with a dumbbell in each hand.",
                "Hold the dumbbells near shoulder level.",
                "Press them overhead.",
                "Lower them slowly back to shoulder level."
            ]
        },


        {
            name: "Dumbbell Lateral Raise",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Lateral Deltoids",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand upright holding dumbbells by your sides.",
                "Keep a slight bend in your elbows.",
                "Raise your arms out to the sides.",
                "Stop around shoulder height.",
                "Lower slowly."
            ]
        },


        {
            name: "Cable Lateral Raise",

            equipment: "Cable Machine",

            difficulty: "Beginner",

            primaryMuscle: "Lateral Deltoids",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand beside a low cable pulley.",
                "Hold the handle with the opposite hand.",
                "Raise your arm out to the side.",
                "Lower the cable slowly."
            ]
        },


        {
            name: "Reverse Pec Deck",

            equipment: "Pec Deck Machine",

            difficulty: "Beginner",

            primaryMuscle: "Rear Deltoids",

            secondaryMuscles: [
                "Upper Back"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Sit facing the machine.",
                "Grip the handles.",
                "Move your arms backward.",
                "Squeeze your rear shoulders.",
                "Return slowly."
            ]
        },


        {
            name: "Face Pull",

            equipment: "Cable Machine + Rope",

            difficulty: "Beginner",

            primaryMuscle: "Rear Deltoids",

            secondaryMuscles: [
                "Trapezius",
                "Rotator Cuff"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Set the cable around face height.",
                "Grip the rope with both hands.",
                "Pull the rope toward your face.",
                "Separate your hands as you pull.",
                "Return under control."
            ]
        }

    ],



    /* Biceps */

    biceps: [

        {
            name: "Dumbbell Biceps Curl",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Biceps",

            secondaryMuscles: [
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand with a dumbbell in each hand.",
                "Keep your elbows close to your torso.",
                "Curl the dumbbells upward.",
                "Squeeze the biceps.",
                "Lower slowly."
            ]
        },


        {
            name: "Hammer Curl",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Biceps",

            secondaryMuscles: [
                "Brachialis",
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Hold the dumbbells with a neutral grip.",
                "Keep your elbows close to your sides.",
                "Curl the dumbbells upward.",
                "Lower slowly."
            ]
        },


        {
            name: "Barbell Biceps Curl",

            equipment: "Barbell",

            difficulty: "Intermediate",

            primaryMuscle: "Biceps",

            secondaryMuscles: [
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Hold the barbell with an underhand grip.",
                "Keep your elbows close to your torso.",
                "Curl the bar upward.",
                "Lower the bar slowly."
            ]
        },


        {
            name: "Incline Dumbbell Curl",

            equipment: "Dumbbells + Incline Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Biceps",

            secondaryMuscles: [
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Sit on an incline bench.",
                "Let your arms hang naturally.",
                "Curl the dumbbells upward.",
                "Lower fully under control."
            ]
        },


        {
            name: "Chin Up",

            equipment: "Pull-Up Bar",

            difficulty: "Intermediate",

            primaryMuscle: "Biceps",

            secondaryMuscles: [
                "Lats",
                "Upper Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Grip the bar with palms facing you.",
                "Start with your arms extended.",
                "Pull your chest toward the bar.",
                "Lower yourself under control."
            ]
        }

    ],



    /* Triceps */

    triceps: [

        {
            name: "Rope Triceps Pushdown",

            equipment: "Cable Machine + Rope",

            difficulty: "Beginner",

            primaryMuscle: "Triceps",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Grip the rope attachment.",
                "Keep your elbows close to your body.",
                "Extend your arms downward.",
                "Separate the rope slightly at the bottom.",
                "Return slowly."
            ]
        },


        {
            name: "Overhead Cable Triceps Extension",

            equipment: "Cable Machine + Rope",

            difficulty: "Beginner",

            primaryMuscle: "Triceps",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Face away from the cable machine.",
                "Hold the rope behind your head.",
                "Keep your elbows pointing forward.",
                "Extend your arms.",
                "Return slowly."
            ]
        },


        {
            name: "Skull Crusher",

            equipment: "EZ Bar + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Triceps",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Lie on a bench holding an EZ bar above you.",
                "Keep your upper arms relatively still.",
                "Bend your elbows to lower the bar.",
                "Extend your elbows to return."
            ]
        },


        {
            name: "Close-Grip Bench Press",

            equipment: "Barbell + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Triceps",

            secondaryMuscles: [
                "Chest",
                "Anterior Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Lie on a flat bench.",
                "Grip the bar around shoulder width.",
                "Lower the bar under control.",
                "Press upward while keeping your elbows controlled."
            ]
        },


        {
            name: "Diamond Push Up",

            equipment: "Bodyweight",

            difficulty: "Intermediate",

            primaryMuscle: "Triceps",

            secondaryMuscles: [
                "Chest",
                "Shoulders"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Place your hands close together under your chest.",
                "Keep your body straight.",
                "Lower yourself toward your hands.",
                "Push back upward."
            ]
        }

    ],



    /* Forearms */

    forearms: [

        {
            name: "Wrist Curl",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Forearms",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Rest your forearms on a bench.",
                "Hold dumbbells with palms facing upward.",
                "Curl your wrists upward.",
                "Lower slowly."
            ]
        },


        {
            name: "Reverse Wrist Curl",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Forearms",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Rest your forearms on a bench.",
                "Hold dumbbells with palms facing downward.",
                "Raise your wrists.",
                "Lower slowly."
            ]
        },


        {
            name: "Farmer's Carry",

            equipment: "Dumbbells",

            difficulty: "Intermediate",

            primaryMuscle: "Forearms",

            secondaryMuscles: [
                "Trapezius",
                "Core"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Hold heavy dumbbells by your sides.",
                "Stand tall.",
                "Walk forward while maintaining good posture.",
                "Keep a strong grip."
            ]
        },


        {
            name: "Dead Hang",

            equipment: "Pull-Up Bar",

            difficulty: "Beginner",

            primaryMuscle: "Forearms",

            secondaryMuscles: [
                "Shoulders",
                "Lats"
            ],

            type: "Isometric",

            videoUrl: "",

            instructions: [
                "Grip the pull-up bar.",
                "Allow your body to hang.",
                "Keep a firm grip.",
                "Maintain controlled shoulder position."
            ]
        }

    ],



    /* Abs */

    abs: [

        {
            name: "Crunch",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Abdominals",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Lie on your back with your knees bent.",
                "Brace your core.",
                "Lift your shoulders from the floor.",
                "Lower under control."
            ]
        },


        {
            name: "Plank",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Core",

            secondaryMuscles: [
                "Shoulders",
                "Glutes"
            ],

            type: "Isometric",

            videoUrl: "",

            instructions: [
                "Place your forearms on the floor.",
                "Extend your legs behind you.",
                "Keep your body in a straight line.",
                "Brace your core and hold."
            ]
        },


        {
            name: "Cable Crunch",

            equipment: "Cable Machine + Rope",

            difficulty: "Intermediate",

            primaryMuscle: "Abdominals",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Kneel in front of a high cable.",
                "Hold the rope near your head.",
                "Contract your abs to flex your torso.",
                "Return slowly."
            ]
        },


        {
            name: "Hanging Leg Raise",

            equipment: "Pull-Up Bar",

            difficulty: "Advanced",

            primaryMuscle: "Abdominals",

            secondaryMuscles: [
                "Hip Flexors"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Hang from a pull-up bar.",
                "Keep your body controlled.",
                "Raise your legs upward.",
                "Lower without swinging."
            ]
        },


        {
            name: "Ab Wheel Rollout",

            equipment: "Ab Wheel",

            difficulty: "Advanced",

            primaryMuscle: "Abdominals",

            secondaryMuscles: [
                "Lats",
                "Shoulders"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Start kneeling with the ab wheel in front of you.",
                "Brace your core.",
                "Roll forward while maintaining control.",
                "Pull yourself back to the starting position."
            ]
        }

    ],



    /* Obliques */

    obliques: [

        {
            name: "Side Plank",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Obliques",

            secondaryMuscles: [
                "Glutes"
            ],

            type: "Isometric",

            videoUrl: "",

            instructions: [
                "Lie on your side.",
                "Support yourself on one forearm.",
                "Lift your hips.",
                "Keep your body straight and hold."
            ]
        },


        {
            name: "Russian Twist",

            equipment: "Bodyweight",

            difficulty: "Intermediate",

            primaryMuscle: "Obliques",

            secondaryMuscles: [
                "Abdominals"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Sit with your knees bent.",
                "Lean your torso slightly backward.",
                "Rotate your torso from side to side.",
                "Keep your core engaged."
            ]
        },


        {
            name: "Cable Wood Chop",

            equipment: "Cable Machine",

            difficulty: "Intermediate",

            primaryMuscle: "Obliques",

            secondaryMuscles: [
                "Abdominals",
                "Shoulders"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Stand beside a cable machine.",
                "Grip the handle with both hands.",
                "Rotate your torso diagonally across your body.",
                "Return under control."
            ]
        }

    ],



    /* Quadriceps */

    quadriceps: [

        {
            name: "Bodyweight Squat",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Quadriceps",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Stand with your feet around shoulder width.",
                "Brace your core.",
                "Bend your knees and hips to squat down.",
                "Push through your feet to stand."
            ]
        },


        {
            name: "Leg Extension",

            equipment: "Leg Extension Machine",

            difficulty: "Beginner",

            primaryMuscle: "Quadriceps",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Adjust the machine to fit your legs.",
                "Sit with your back against the pad.",
                "Extend your knees.",
                "Lower slowly."
            ]
        },


        {
            name: "Leg Press",

            equipment: "Leg Press Machine",

            difficulty: "Beginner",

            primaryMuscle: "Quadriceps",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Place your feet on the platform.",
                "Release the safety handles.",
                "Lower the platform under control.",
                "Press through your feet to extend your legs."
            ]
        },


        {
            name: "Barbell Back Squat",

            equipment: "Barbell + Squat Rack",

            difficulty: "Intermediate",

            primaryMuscle: "Quadriceps",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings",
                "Core"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Position the bar securely across your upper back.",
                "Stand with your feet around shoulder width.",
                "Brace your core.",
                "Squat down under control.",
                "Drive upward through your feet."
            ]
        },


        {
            name: "Bulgarian Split Squat",

            equipment: "Dumbbells + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Quadriceps",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Place one foot behind you on a bench.",
                "Keep your front foot firmly planted.",
                "Lower your body by bending your front knee.",
                "Push through your front foot to rise."
            ]
        }

    ],



    /* Tibialis */

    tibialis: [

        {
            name: "Standing Tibialis Raise",

            equipment: "Bodyweight + Wall",

            difficulty: "Beginner",

            primaryMuscle: "Tibialis Anterior",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Lean your back against a wall.",
                "Keep your heels on the floor.",
                "Raise your toes upward.",
                "Lower slowly."
            ]
        },


        {
            name: "Resistance Band Dorsiflexion",

            equipment: "Resistance Band",

            difficulty: "Beginner",

            primaryMuscle: "Tibialis Anterior",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Attach a resistance band in front of your foot.",
                "Loop it around your forefoot.",
                "Pull your toes toward your shin.",
                "Return slowly."
            ]
        }

    ],



    /* Calves */

    calves: [

        {
            name: "Standing Calf Raise",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Calves",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand upright.",
                "Raise your heels from the floor.",
                "Pause at the top.",
                "Lower slowly."
            ]
        },


        {
            name: "Seated Calf Raise",

            equipment: "Seated Calf Raise Machine",

            difficulty: "Beginner",

            primaryMuscle: "Calves",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Sit in the machine.",
                "Place the balls of your feet on the platform.",
                "Raise your heels.",
                "Lower under control."
            ]
        },


        {
            name: "Leg Press Calf Raise",

            equipment: "Leg Press Machine",

            difficulty: "Beginner",

            primaryMuscle: "Calves",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Place the balls of your feet on the leg press platform.",
                "Keep your knees mostly extended.",
                "Push the platform by extending your ankles.",
                "Lower your heels slowly."
            ]
        }

    ],



    /* Traps */

    traps: [

        {
            name: "Dumbbell Shrug",

            equipment: "Dumbbells",

            difficulty: "Beginner",

            primaryMuscle: "Trapezius",

            secondaryMuscles: [
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Hold dumbbells by your sides.",
                "Keep your arms relaxed.",
                "Raise your shoulders upward.",
                "Lower slowly."
            ]
        },


        {
            name: "Barbell Shrug",

            equipment: "Barbell",

            difficulty: "Beginner",

            primaryMuscle: "Trapezius",

            secondaryMuscles: [
                "Forearms"
            ],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Hold a barbell in front of your body.",
                "Keep your arms straight.",
                "Elevate your shoulders.",
                "Lower under control."
            ]
        },


        {
            name: "Face Pull",

            equipment: "Cable Machine + Rope",

            difficulty: "Beginner",

            primaryMuscle: "Upper Back",

            secondaryMuscles: [
                "Rear Deltoids",
                "Trapezius"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Set the cable near face height.",
                "Grip the rope.",
                "Pull it toward your face.",
                "Squeeze your upper back.",
                "Return slowly."
            ]
        }

    ],



    /* Lats */

    lats: [

        {
            name: "Lat Pulldown",

            equipment: "Lat Pulldown Machine",

            difficulty: "Beginner",

            primaryMuscle: "Latissimus Dorsi",

            secondaryMuscles: [
                "Biceps",
                "Upper Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Grip the bar wider than shoulder width.",
                "Keep your chest lifted.",
                "Pull the bar toward your upper chest.",
                "Return slowly."
            ]
        },


        {
            name: "Straight-Arm Pulldown",

            equipment: "Cable Machine",

            difficulty: "Beginner",

            primaryMuscle: "Latissimus Dorsi",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Stand facing a high cable pulley.",
                "Hold the bar with mostly straight arms.",
                "Pull the bar toward your thighs.",
                "Return under control."
            ]
        },


        {
            name: "Pull Up",

            equipment: "Pull-Up Bar",

            difficulty: "Intermediate",

            primaryMuscle: "Latissimus Dorsi",

            secondaryMuscles: [
                "Biceps",
                "Upper Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Grip the bar with palms facing away.",
                "Hang with your arms extended.",
                "Pull your chest toward the bar.",
                "Lower under control."
            ]
        },


        {
            name: "Barbell Bent-Over Row",

            equipment: "Barbell",

            difficulty: "Intermediate",

            primaryMuscle: "Lats",

            secondaryMuscles: [
                "Upper Back",
                "Biceps",
                "Rear Deltoids"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Hold the barbell and hinge at your hips.",
                "Keep your spine controlled.",
                "Pull the bar toward your torso.",
                "Lower slowly."
            ]
        },


        {
            name: "Single-Arm Dumbbell Row",

            equipment: "Dumbbell + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Lats",

            secondaryMuscles: [
                "Biceps",
                "Upper Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Support yourself on a bench.",
                "Hold the dumbbell with your free hand.",
                "Pull it toward your hip.",
                "Lower under control."
            ]
        }

    ],



    /* Lower Back */

    lowerBack: [

        {
            name: "Bird Dog",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Lower Back",

            secondaryMuscles: [
                "Core",
                "Glutes"
            ],

            type: "Stability",

            videoUrl: "",

            instructions: [
                "Start on your hands and knees.",
                "Extend one arm and the opposite leg.",
                "Keep your torso stable.",
                "Return and repeat on the other side."
            ]
        },


        {
            name: "Back Extension",

            equipment: "Roman Chair",

            difficulty: "Beginner",

            primaryMuscle: "Lower Back",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Position yourself securely on the Roman chair.",
                "Lower your torso under control.",
                "Extend your hips to raise your torso.",
                "Avoid excessive lower-back extension."
            ]
        },


        {
            name: "Barbell Deadlift",

            equipment: "Barbell",

            difficulty: "Intermediate",

            primaryMuscle: "Posterior Chain",

            secondaryMuscles: [
                "Glutes",
                "Hamstrings",
                "Lower Back",
                "Trapezius"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Stand close to the barbell.",
                "Hinge at the hips and grip the bar.",
                "Brace your core.",
                "Drive through the floor to stand.",
                "Lower the bar under control."
            ]
        }

    ],



    /* Glutes */

    glutes: [

        {
            name: "Glute Bridge",

            equipment: "Bodyweight",

            difficulty: "Beginner",

            primaryMuscle: "Glutes",

            secondaryMuscles: [
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Lie on your back with knees bent.",
                "Keep your feet flat on the floor.",
                "Drive your hips upward.",
                "Squeeze your glutes.",
                "Lower slowly."
            ]
        },


        {
            name: "Cable Glute Kickback",

            equipment: "Cable Machine",

            difficulty: "Beginner",

            primaryMuscle: "Glutes",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Attach an ankle strap to a low cable.",
                "Brace your body.",
                "Extend your leg backward.",
                "Squeeze your glutes.",
                "Return slowly."
            ]
        },


        {
            name: "Barbell Hip Thrust",

            equipment: "Barbell + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Glutes",

            secondaryMuscles: [
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Position your upper back against a bench.",
                "Place the barbell across your hips.",
                "Drive your hips upward.",
                "Squeeze your glutes at the top.",
                "Lower under control."
            ]
        },


        {
            name: "Bulgarian Split Squat",

            equipment: "Dumbbells + Bench",

            difficulty: "Intermediate",

            primaryMuscle: "Glutes",

            secondaryMuscles: [
                "Quadriceps",
                "Hamstrings"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Place your rear foot on a bench.",
                "Keep your front foot stable.",
                "Lower your body.",
                "Drive upward through your front foot."
            ]
        }

    ],



    /* Hamstrings */

    hamstrings: [

        {
            name: "Seated Leg Curl",

            equipment: "Seated Leg Curl Machine",

            difficulty: "Beginner",

            primaryMuscle: "Hamstrings",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Adjust the machine to fit your legs.",
                "Sit with your back against the pad.",
                "Curl your lower legs downward.",
                "Return slowly."
            ]
        },


        {
            name: "Lying Leg Curl",

            equipment: "Lying Leg Curl Machine",

            difficulty: "Beginner",

            primaryMuscle: "Hamstrings",

            secondaryMuscles: [],

            type: "Isolation",

            videoUrl: "",

            instructions: [
                "Lie face down on the machine.",
                "Place the pad behind your lower legs.",
                "Curl your heels toward your glutes.",
                "Lower slowly."
            ]
        },


        {
            name: "Romanian Deadlift",

            equipment: "Barbell",

            difficulty: "Intermediate",

            primaryMuscle: "Hamstrings",

            secondaryMuscles: [
                "Glutes",
                "Lower Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Hold the bar in front of your thighs.",
                "Keep a slight bend in your knees.",
                "Push your hips backward.",
                "Lower the bar while maintaining control.",
                "Drive your hips forward to stand."
            ]
        },


        {
            name: "Dumbbell Romanian Deadlift",

            equipment: "Dumbbells",

            difficulty: "Intermediate",

            primaryMuscle: "Hamstrings",

            secondaryMuscles: [
                "Glutes",
                "Lower Back"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Hold dumbbells in front of your thighs.",
                "Push your hips backward.",
                "Keep the dumbbells close to your legs.",
                "Feel a stretch in your hamstrings.",
                "Drive your hips forward to return."
            ]
        },


        {
            name: "Nordic Hamstring Curl",

            equipment: "Bodyweight + Ankle Support",

            difficulty: "Advanced",

            primaryMuscle: "Hamstrings",

            secondaryMuscles: [
                "Glutes"
            ],

            type: "Compound",

            videoUrl: "",

            instructions: [
                "Secure your ankles.",
                "Start kneeling with your torso upright.",
                "Slowly lower your body forward.",
                "Use your hamstrings to resist the descent.",
                "Use assistance if necessary to return."
            ]
        }

    ]

};



/* SVG Groups */

const muscleGroups = {

    chest: [
        "upper-pectoralis",
        "mid-lower-pectoralis"
    ],

    shoulders: [
        "anterior-deltoid",
        "lateral-deltoid",
        "posterior-deltoid"
    ],

    biceps: [
        "long-head-bicep",
        "short-head-bicep"
    ],

    triceps: [
        "long-head-triceps",
        "lateral-head-triceps",
        "medial-head-triceps"
    ],

    forearms: [
        "wrist-flexors",
        "wrist-extensors"
    ],

    abs: [
        "upper-abdominals",
        "lower-abdominals"
    ],

    obliques: [
        "obliques"
    ],

    quadriceps: [
        "outer-quadricep",
        "rectus-femoris",
        "inner-quadricep"
    ],

    tibialis: [
        "tibialis"
    ],

    calves: [
        "gastrocnemius",
        "soleus"
    ],

    traps: [
        "upper-trapezius",
        "traps-middle",
        "lower-trapezius"
    ],

    lats: [
        "lats"
    ],

    lowerBack: [
        "lowerback"
    ],

    glutes: [
        "gluteus-maximus",
        "gluteus-medius"
    ],

    hamstrings: [
        "lateral-hamstrings",
        "medial-hamstrings"
    ]

};



/* Names */

const muscleNames = {

    chest:
        "Chest",

    shoulders:
        "Shoulders",

    biceps:
        "Biceps",

    triceps:
        "Triceps",

    forearms:
        "Forearms",

    abs:
        "Abdominals",

    obliques:
        "Obliques",

    quadriceps:
        "Quadriceps",

    tibialis:
        "Tibialis Anterior",

    calves:
        "Calves",

    traps:
        "Trapezius",

    lats:
        "Latissimus Dorsi",

    lowerBack:
        "Lower Back",

    glutes:
        "Glutes",

    hamstrings:
        "Hamstrings"

};



/* Elements */

let exerciseModal = null;

let modalElement = null;

let muscleTitle = null;

let exerciseList = null;

let mapStatus = null;

let exerciseListView = null;

let exerciseDetailView = null;

let backToExerciseList = null;

let exerciseDetailName = null;

let exerciseDetailEquipment = null;

let exerciseDetailDifficulty = null;

let exerciseDetailPrimary = null;

let exerciseDetailType = null;

let secondaryMuscles = null;

let exerciseInstructions = null;

let exerciseVideo = null;

let exerciseVideoContainer = null;

let videoUnavailable = null;

let watchOnYouTube = null;

let currentMuscleName = null;



/* Start */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        getElements();

        setupModal();

        setupBackButton();

        await loadMuscleMaps();

    }
);



/* Elements */

function getElements() {

    modalElement =
        document.getElementById(
            "exerciseModal"
        );

    muscleTitle =
        document.getElementById(
            "muscleTitle"
        );

    exerciseList =
        document.getElementById(
            "exerciseList"
        );

    mapStatus =
        document.getElementById(
            "mapStatus"
        );

    exerciseListView =
        document.getElementById(
            "exerciseListView"
        );

    exerciseDetailView =
        document.getElementById(
            "exerciseDetailView"
        );

    backToExerciseList =
        document.getElementById(
            "backToExerciseList"
        );

    exerciseDetailName =
        document.getElementById(
            "exerciseDetailName"
        );

    exerciseDetailEquipment =
        document.getElementById(
            "exerciseDetailEquipment"
        );

    exerciseDetailDifficulty =
        document.getElementById(
            "exerciseDetailDifficulty"
        );

    exerciseDetailPrimary =
        document.getElementById(
            "exerciseDetailPrimary"
        );

    exerciseDetailType =
        document.getElementById(
            "exerciseDetailType"
        );

    secondaryMuscles =
        document.getElementById(
            "secondaryMuscles"
        );

    exerciseInstructions =
        document.getElementById(
            "exerciseInstructions"
        );

    exerciseVideo =
        document.getElementById(
            "exerciseVideo"
        );

    exerciseVideoContainer =
        document.getElementById(
            "exerciseVideoContainer"
        );

    videoUnavailable =
        document.getElementById(
            "videoUnavailable"
        );

    watchOnYouTube =
        document.getElementById(
            "watchOnYouTube"
        );

}



/* Modal */

function setupModal() {

    if (!modalElement) {

        console.error(
            "#exerciseModal not found"
        );

        return;

    }


    exerciseModal =
        new bootstrap.Modal(
            modalElement
        );


    modalElement.addEventListener(
        "hidden.bs.modal",
        function () {

            clearSelection();

            resetExerciseView();

        }
    );

}



/* Back */

function setupBackButton() {

    if (!backToExerciseList) {

        return;

    }


    backToExerciseList.addEventListener(
        "click",
        function () {

            showExerciseListView();

        }
    );

}



/* Load Maps */

async function loadMuscleMaps() {

    console.log(
        "Starting Muscle Map..."
    );


    const frontResult =
        await loadSvg(
            "/images/muscles/anatomy-front.svg",
            "frontMuscleMap"
        );


    const backResult =
        await loadSvg(
            "/images/muscles/anatomy-back.svg",
            "backMuscleMap"
        );


    if (
        !frontResult &&
        !backResult
    ) {

        if (mapStatus) {

            mapStatus.innerHTML = `
                <div class="map-error">

                    Unable to load anatomy SVG files.

                </div>
            `;

        }

        return;

    }


    setupMuscles();


    if (mapStatus) {

        mapStatus.style.display =
            "none";

    }


    console.log(
        "Muscle Map ready"
    );

}



/* Load SVG */

async function loadSvg(
    path,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        console.error(
            `Container not found: #${containerId}`
        );

        return false;

    }


    try {

        const response =
            await fetch(
                path
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const svgText =
            await response.text();


        if (
            !svgText.includes(
                "<svg"
            )
        ) {

            throw new Error(
                "Invalid SVG"
            );

        }


        container.innerHTML =
            svgText;


        const svg =
            container.querySelector(
                "svg"
            );


        if (!svg) {

            throw new Error(
                "SVG element not found"
            );

        }


        svg.classList.add(
            "anatomy-svg"
        );


        svg.removeAttribute(
            "width"
        );


        svg.removeAttribute(
            "height"
        );


        return true;

    }

    catch (error) {

        console.error(
            `Cannot load ${path}:`,
            error
        );


        container.innerHTML = `
            <div class="map-error">

                Unable to load anatomy.

                <br>

                ${path}

            </div>
        `;


        return false;

    }

}



/* Setup */

function setupMuscles() {

    Object.entries(
        muscleGroups
    ).forEach(

        function (
            [
                muscleName,
                svgIds
            ]
        ) {

            svgIds.forEach(

                function (svgId) {

                    const regions =
                        document.querySelectorAll(
                            `[id="${svgId}"]`
                        );


                    regions.forEach(

                        function (region) {

                            makeRegionInteractive(
                                region,
                                muscleName
                            );

                        }

                    );

                }

            );

        }

    );

}



/* Interactive */

function makeRegionInteractive(
    region,
    muscleName
) {

    region.classList.add(
        "muscle-region"
    );


    region.dataset.muscle =
        muscleName;


    region.setAttribute(
        "tabindex",
        "0"
    );


    region.setAttribute(
        "role",
        "button"
    );


    region.setAttribute(
        "aria-label",
        muscleNames[muscleName]
    );


    region.addEventListener(
        "click",
        function () {

            selectMuscle(
                muscleName
            );

        }
    );


    region.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
                ||
                event.key === " "
            ) {

                event.preventDefault();


                selectMuscle(
                    muscleName
                );

            }

        }
    );

}



/* Select */

function selectMuscle(
    muscleName
) {

    clearSelection();


    currentMuscleName =
        muscleName;


    const selectedRegions =
        document.querySelectorAll(
            `[data-muscle="${muscleName}"]`
        );


    selectedRegions.forEach(

        function (region) {

            region.classList.add(
                "active"
            );

        }

    );


    showExercises(
        muscleName
    );

}



/* Clear */

function clearSelection() {

    const regions =
        document.querySelectorAll(
            ".muscle-region"
        );


    regions.forEach(

        function (region) {

            region.classList.remove(
                "active"
            );

        }

    );

}



/* Exercises */

function showExercises(
    muscleName
) {

    const muscleExercises =
        exercises[muscleName]
        || [];


    currentMuscleName =
        muscleName;


    showExerciseListView();


    muscleTitle.textContent =
        muscleNames[muscleName]
        ||
        muscleName;


    exerciseList.innerHTML =
        "";


    if (
        muscleExercises.length === 0
    ) {

        exerciseList.innerHTML = `
            <div class="col-12">

                <div class="alert alert-warning">

                    No exercises available.

                </div>

            </div>
        `;


        exerciseModal.show();

        return;

    }


    muscleExercises.forEach(

        function (exercise) {

            const card =
                createExerciseCard(
                    exercise,
                    muscleName
                );


            exerciseList.appendChild(
                card
            );

        }

    );


    exerciseModal.show();

}



/* Card */

function createExerciseCard(
    exercise,
    muscleName
) {

    const column =
        document.createElement(
            "div"
        );


    column.className =
        "col-md-6";


    const difficultyClass =
        getDifficultyClass(
            exercise.difficulty
        );


    column.innerHTML = `
        <div
            class="exercise-item"
            tabindex="0"
            role="button"
        >

            <div class="exercise-icon">

                <i class="bi bi-lightning-charge-fill"></i>

            </div>


            <h4 class="fw-bold">

                ${exercise.name}

            </h4>


            <p class="text-body-secondary mb-2">

                <i class="bi bi-tools me-2"></i>

                ${exercise.equipment}

            </p>


            <span
                class="
                    exercise-difficulty
                    ${difficultyClass}
                "
            >

                ${exercise.difficulty}

            </span>


            <div class="mt-3 text-success fw-semibold">

                View exercise

                <i class="bi bi-arrow-right ms-1"></i>

            </div>

        </div>
    `;


    const item =
        column.querySelector(
            ".exercise-item"
        );


    item.addEventListener(
        "click",
        function () {

            showExerciseDetail(
                exercise,
                muscleName
            );

        }
    );


    item.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
                ||
                event.key === " "
            ) {

                event.preventDefault();


                showExerciseDetail(
                    exercise,
                    muscleName
                );

            }

        }
    );


    return column;

}



/* Detail */

function showExerciseDetail(
    exercise,
    muscleName
) {

    exerciseListView.classList.add(
        "d-none"
    );


    exerciseDetailView.classList.remove(
        "d-none"
    );


    muscleTitle.textContent =
        exercise.name;


    exerciseDetailName.textContent =
        exercise.name;


    exerciseDetailEquipment.textContent =
        exercise.equipment
        ||
        "Not specified";


    exerciseDetailDifficulty.textContent =
        exercise.difficulty
        ||
        "Not specified";


    exerciseDetailPrimary.textContent =
        exercise.primaryMuscle
        ||
        muscleNames[muscleName]
        ||
        "Not specified";


    exerciseDetailType.textContent =
        exercise.type
        ||
        "Not specified";


    showSecondaryMuscles(
        exercise.secondaryMuscles
    );


    showInstructions(
        exercise.instructions
    );


    showExerciseVideo(
        exercise.videoUrl
    );

}



/* List */

function showExerciseListView() {

    if (
        !exerciseListView
        ||
        !exerciseDetailView
    ) {

        return;

    }


    exerciseDetailView.classList.add(
        "d-none"
    );


    exerciseListView.classList.remove(
        "d-none"
    );


    stopVideo();


    if (
        currentMuscleName
    ) {

        muscleTitle.textContent =
            muscleNames[
                currentMuscleName
            ]
            ||
            currentMuscleName;

    }

}



/* Secondary */

function showSecondaryMuscles(
    muscles
) {

    secondaryMuscles.innerHTML =
        "";


    if (
        !muscles
        ||
        muscles.length === 0
    ) {

        secondaryMuscles.innerHTML = `
            <span class="text-body-secondary">

                None

            </span>
        `;

        return;

    }


    muscles.forEach(

        function (muscle) {

            const badge =
                document.createElement(
                    "span"
                );


            badge.className =
                "secondary-muscle";


            badge.textContent =
                muscle;


            secondaryMuscles.appendChild(
                badge
            );

        }

    );

}



/* Instructions */

function showInstructions(
    instructions
) {

    exerciseInstructions.innerHTML =
        "";


    if (
        !instructions
        ||
        instructions.length === 0
    ) {

        exerciseInstructions.innerHTML = `
            <li>

                Instructions have not been added yet.

            </li>
        `;

        return;

    }


    instructions.forEach(

        function (instruction) {

            const step =
                document.createElement(
                    "li"
                );


            step.textContent =
                instruction;


            exerciseInstructions.appendChild(
                step
            );

        }

    );

}



/* Video */

function showExerciseVideo(
    videoUrl
) {

    const embedUrl =
        getYouTubeEmbedUrl(
            videoUrl
        );


    if (!embedUrl) {

        stopVideo();


        exerciseVideoContainer.classList.add(
            "d-none"
        );


        videoUnavailable.classList.remove(
            "d-none"
        );


        watchOnYouTube.classList.add(
            "d-none"
        );


        return;

    }


    videoUnavailable.classList.add(
        "d-none"
    );


    exerciseVideoContainer.classList.remove(
        "d-none"
    );


    exerciseVideo.src =
        embedUrl;


    watchOnYouTube.href =
        videoUrl;


    watchOnYouTube.classList.remove(
        "d-none"
    );

}



/* YouTube */

function getYouTubeEmbedUrl(
    videoUrl
) {

    if (!videoUrl) {

        return "";

    }


    try {

        const url =
            new URL(
                videoUrl
            );


        let videoId =
            "";


        if (
            url.hostname.includes(
                "youtu.be"
            )
        ) {

            videoId =
                url.pathname
                    .replace(
                        "/",
                        ""
                    );

        }


        else if (
            url.hostname.includes(
                "youtube.com"
            )
        ) {

            if (
                url.pathname ===
                "/watch"
            ) {

                videoId =
                    url.searchParams.get(
                        "v"
                    );

            }


            else if (
                url.pathname.startsWith(
                    "/shorts/"
                )
            ) {

                videoId =
                    url.pathname.split(
                        "/"
                    )[2];

            }


            else if (
                url.pathname.startsWith(
                    "/embed/"
                )
            ) {

                videoId =
                    url.pathname.split(
                        "/"
                    )[2];

            }

        }


        if (!videoId) {

            return "";

        }


        return (
            `https://www.youtube.com/embed/${videoId}`
        );

    }

    catch (error) {

        console.error(
            "Invalid YouTube URL:",
            videoUrl
        );


        return "";

    }

}



/* Stop Video */

function stopVideo() {

    if (exerciseVideo) {

        exerciseVideo.src =
            "";

    }

}



/* Reset */

function resetExerciseView() {

    stopVideo();


    currentMuscleName =
        null;


    if (exerciseDetailView) {

        exerciseDetailView.classList.add(
            "d-none"
        );

    }


    if (exerciseListView) {

        exerciseListView.classList.remove(
            "d-none"
        );

    }


    if (watchOnYouTube) {

        watchOnYouTube.classList.add(
            "d-none"
        );

    }

}



/* Difficulty */

function getDifficultyClass(
    difficulty
) {

    if (
        difficulty === "Beginner"
    ) {

        return (
            "difficulty-beginner"
        );

    }


    if (
        difficulty === "Intermediate"
    ) {

        return (
            "difficulty-intermediate"
        );

    }


    return (
        "difficulty-advanced"
    );

}