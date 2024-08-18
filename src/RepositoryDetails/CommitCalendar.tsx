import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';


// Helper function to transform commit data into a calendar-friendly format
const transformCommitData = (events, currentUser) => {
    const commitData = {};

    events.forEach(event => {
        if (event.actor.login === currentUser) {
            event.payload.commits.forEach(commit => {
                const commitDate = new Date(event.created_at).toISOString().split('T')[0];
                commitData[commitDate] = (commitData[commitDate] || 0) + 1;
            });
        }
    });

    return Object.entries(commitData).map(([date, count]) => ({
        date,
        count,
    }));
};

export default  function CommitCalendar( { currentUser, commitEvents }) {

    const transformedData = transformCommitData(commitEvents, currentUser);


    const today = new Date();


    return (
        <div>
            <h2>Commit History Calendar</h2>
    <CalendarHeatmap
    startDate={new Date(today.getFullYear(), today.getMonth() - 11, today.getDate())}
    endDate={today}
    values={transformedData}
    classForValue={(value) => {
        if (!value) {
            return 'color-empty';
        }
        return `color-gitlab-${Math.min(value.count, 4)}`;
    }}
    showWeekdayLabels={true}
    tooltipDataAttrs={value => {
        return {
            'data-tip': value ? `${value.count} commits on ${value.date}` : 'No commits',
        };
    }}
    />
    </div>
);
};

