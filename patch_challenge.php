<?php
// Patch file to create DynamicChallengeController and add route to api.php
$controllerPath = 'd:/Project/Icraft/ic-Game Z - Backend/app/Http/Controllers/Api/V1/DynamicChallengeController.php';
$controllerCode = <<<EOD
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DynamicChallengeController extends Controller
{
    public function active(Request \$request): JsonResponse
    {
        // Mocking the dynamic active challenge for demonstration
        \$challenge = [
            'id' => 99,
            'title' => 'Ngoding Malming Yuks',
            'difficulty' => 'Sedang',
            'description_html' => '<p>Malam minggu daripada galau, mending kita ngoding! Buatlah sebuah fungsi <code>ngodingMalming(hours)</code> yang menerima array berisi jam tidur, dan kembalikan total jam tidur tersebut. Jika array kosong, kembalikan 0.</p>',
            'template_code' => "/**\\n * @param {number[]} hours\\n * @return {number}\\n */\\nvar ngodingMalming = function(hours) {\\n    // Tulis kodemu di sini\\n};",
            'function_name' => 'ngodingMalming',
            'test_cases' => [
                [ 'input' => [[5, 6, 7]], 'expected' => 18 ],
                [ 'input' => [[8, 8]], 'expected' => 16 ],
                [ 'input' => [[]], 'expected' => 0 ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => \$challenge
        ]);
    }
}
EOD;

file_put_contents($controllerPath, $controllerCode);
echo "Created Controller.\n";

$apiRoutesPath = 'd:/Project/Icraft/ic-Game Z - Backend/routes/api.php';
$apiRoutesContent = file_get_contents($apiRoutesPath);

// Check if route already exists
if (strpos($apiRoutesContent, 'challenges/active') === false) {
    // We want to insert the route inside the auth:sanctum middleware group, or publicly. Let's make it public for now or put it near the other challenges routes.
    // Wait, the API routes are probably grouped.
    // Let's just append it to the file using Route::get.
    $routeInjection = "\nuse App\Http\Controllers\Api\V1\DynamicChallengeController;\nRoute::get('v1/challenges/active', [DynamicChallengeController::class, 'active']);\n";
    file_put_contents($apiRoutesPath, $apiRoutesContent . $routeInjection);
    echo "Added Route.\n";
} else {
    echo "Route already exists.\n";
}
