export const buildTrainingRecommendations = ({ attendanceRate, approvedAchievements, campsJoined, streak }) => {
  const recommendations = [];

  if (attendanceRate < 75) {
    recommendations.push({
      title: "Attendance Recovery Drill",
      priority: "High",
      message: "Focus on parade consistency and weekly attendance accountability."
    });
  }

  if (approvedAchievements < 2) {
    recommendations.push({
      title: "Skill Development Sprint",
      priority: "Medium",
      message: "Complete one certified drill, leadership, or community project this month."
    });
  }

  if (campsJoined < 1) {
    recommendations.push({
      title: "Field Camp Exposure",
      priority: "Medium",
      message: "Apply for the next available camp to improve field-readiness score."
    });
  }

  if (streak >= 3) {
    recommendations.push({
      title: "Leadership Track",
      priority: "Low",
      message: "Eligible for squad leadership mentoring and advanced planning modules."
    });
  }

  return recommendations.length
    ? recommendations
    : [
        {
          title: "Elite Cadet Progression",
          priority: "Low",
          message: "Maintain current performance and prepare for advanced camp leadership opportunities."
        }
      ];
};
