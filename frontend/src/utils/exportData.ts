import { Stats, FollowerCount } from '../types/api';

/**
 * Export statistics data to CSV format
 */
export const exportToCSV = (stats: Stats, followerCounts: FollowerCount[]) => {
  const timestamp = new Date().toISOString().split('T')[0];

  // Create CSV content
  let csvContent = 'Instagram Follower Statistics\n\n';

  // Summary statistics
  csvContent += 'Summary\n';
  csvContent += 'Category,Count\n';
  csvContent += `Whitelist,${stats.whitelist.count}\n`;
  csvContent += `Non-Followers,${stats.nonFollowers.count}\n`;
  csvContent += `Ex-Followers,${stats.exFollowers.count}\n`;
  csvContent += `Total Tracked,${stats.totalTracked}\n\n`;

  // Follower count history
  if (followerCounts.length > 0) {
    csvContent += 'Follower Count History\n';
    csvContent += 'Date,Count\n';
    followerCounts.reverse().forEach(record => {
      const date = new Date(record.recorded_at).toISOString();
      csvContent += `${date},${record.count}\n`;
    });
    csvContent += '\n';
  }

  // Recent ex-followers
  if (stats.exFollowers.recent.length > 0) {
    csvContent += 'Recent Ex-Followers\n';
    csvContent += 'Username,Unfollowed Date\n';
    stats.exFollowers.recent.forEach(user => {
      const date = new Date(user.unfollowed_at).toISOString();
      csvContent += `${user.username},${date}\n`;
    });
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `instagram-stats-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export statistics data to JSON format
 */
export const exportToJSON = (stats: Stats, followerCounts: FollowerCount[]) => {
  const timestamp = new Date().toISOString().split('T')[0];

  const data = {
    exportDate: new Date().toISOString(),
    summary: {
      whitelist: stats.whitelist.count,
      nonFollowers: stats.nonFollowers.count,
      exFollowers: stats.exFollowers.count,
      totalTracked: stats.totalTracked,
    },
    followerCountHistory: followerCounts.map(record => ({
      date: record.recorded_at,
      count: record.count,
    })),
    recentExFollowers: stats.exFollowers.recent.map(user => ({
      username: user.username,
      unfollowedDate: user.unfollowed_at,
    })),
  };

  const jsonContent = JSON.stringify(data, null, 2);

  // Create and download file
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `instagram-stats-${timestamp}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
