<?php
$file = 'd:/Project/Icraft/ic-Game Z - Backend/app/Services/UserService.php';
$content = file_get_contents($file);
$search = <<<EOD
            'rank' => [
                'all_time' => \$this->leaderboardService->getUserRank(\$user),
                'this_month' => \$this->leaderboardService->getUserMonthlyRank(\$user),
            ],
            'recent_activities' => \$recentActivities,
EOD;
$replace = <<<EOD
            'rank' => [
                'all_time' => \$this->leaderboardService->getUserRank(\$user),
                'this_month' => \$this->leaderboardService->getUserMonthlyRank(\$user),
            ],
            'events' => [
                'daily' => DB::table('event_submissions')
                    ->join('events', 'event_submissions.event_id', '=', 'events.id')
                    ->where('event_submissions.user_id', \$user->id)
                    ->where('event_submissions.status', 'approved')
                    ->where('events.type', 'daily')
                    ->count(),
                'weekly' => DB::table('event_submissions')
                    ->join('events', 'event_submissions.event_id', '=', 'events.id')
                    ->where('event_submissions.user_id', \$user->id)
                    ->where('event_submissions.status', 'approved')
                    ->where('events.type', 'weekly')
                    ->count(),
                'annual' => DB::table('event_submissions')
                    ->join('events', 'event_submissions.event_id', '=', 'events.id')
                    ->where('event_submissions.user_id', \$user->id)
                    ->where('event_submissions.status', 'approved')
                    ->where('events.type', 'annual')
                    ->count(),
            ],
            'recent_activities' => \$recentActivities,
EOD;
if (strpos($content, "'events' => [") === false) {
    file_put_contents($file, str_replace($search, $replace, $content));
    echo "Patched successfully.\n";
} else {
    echo "Already patched.\n";
}
