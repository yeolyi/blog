import { graphql } from '@octokit/graphql';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

interface GraphQLResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: ContributionWeek[];
      };
    };
  };
}

interface ContributionWeek {
  contributionDays: {
    contributionCount: number;
    contributionLevel: number;
    date: string;
  }[];
}

export default async function ContributionGraph() {
  const resp: GraphQLResponse = await graphqlWithAuth(
    `query($userName:String!) {
    user(login: $userName){
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
    }
  }`,
    { userName: 'yeolyi' },
  );

  const weeks = resp.user.contributionsCollection.contributionCalendar.weeks;

  return (
    <div className="flex font-firacode leading-none cursor-none text-lg">
      {weeks.map((week, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-col whitespace-pre"
          >
            {week.contributionDays.map((day) => {
              if (day.contributionCount === 0) {
                console.log(day.date);
              }
              return (
                <span
                  key={day.date}
                  className="hover:bg-[#E9390B]"
                >
                  {countToChar(day.contributionCount)}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const countToChar = (count: number) => {
  if (0xf < count) return '+';
  if (count === 0) return ' ';
  return '0123456789ABCDEF'[count];
};
