import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

const GuidedTour = () => {
    const [run, setRun] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("has_seen_tour");
        if (!hasSeenTour) {
            setRun(true);
        }
    }, []);

    const steps: Step[] = [
        {
            target: "#navbar-logo",
            content: "Welcome to Go-Nepal! Your ultimate companion for trekking and exploring the Himalayas.",
            disableBeacon: true,
        },
        {
            target: "#language-toggle",
            content: "Need to speak like a local? Switch languages instantly to translate the entire app into Nepali or other languages.",
        },
        {
            target: "#tourist-id-link",
            content: "Get your Digital Tourist ID. It works offline and carries your essential trek data even at 5,000m.",
        },
        {
            target: "#plan-my-day-trigger",
            content: "Try our AI Concierge! It uses live weather and latest news/alerts to craft the perfect itinerary for you.",
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
            setRun(false);
            localStorage.setItem("has_seen_tour", "true");
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    primaryColor: "#E41B17",
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: "left",
                    borderRadius: "20px",
                },
                buttonNext: {
                    borderRadius: "12px",
                    fontWeight: "bold",
                },
                buttonBack: {
                    fontWeight: "bold",
                }
            }}
        />
    );
};

export default GuidedTour;
