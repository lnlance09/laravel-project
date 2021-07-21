<?php

namespace Database\Factories;

use App\Models\Coin;
use App\Models\Prediction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterMaking(function (User $user) {
        })->afterCreating(function (User $user) {
            if (env('SEED_WITH_IMPORTS', false)) {
                $totalCount = mt_rand(5, 30);
                $percentCorrect = mt_rand(20, 80) / 100;
                $correctCount = $totalCount * $percentCorrect;
                $incorrectCount = $totalCount - $correctCount;

                // Create correct predictions
                $this->createPredictions($user, $correctCount);

                // Create incorrect predictions
                $this->createPredictions($user, $incorrectCount, false);
            }
        });
    }

    private function createPredictions($user, $amount, $correct = true)
    {
        for ($i = 0; $i < $amount; $i++) {
            $coin = current(Coin::all()->random(1)->toArray());
            $coinId = $coin['cmc_id'];

            $target = $this->faker->dateTimeBetween('-6 months', '-7 days');
            $targetDate = $target->getTimestamp();

            $minsBefore = mt_rand(7200, 72000);
            $createdAt = strtotime('-' . $minsBefore . ' minutes', $targetDate);

            $margin = ($correct ? rand(1, 50) : rand(51, 4000)) / 10;
            $margin = $i < 2 || $i % 2 === 1 ? $margin : -$margin;

            // price at time of prediction
            $currentPrice = (float) Coin::getPriceAtTimeCMC($coinId, $createdAt);
            if (!$currentPrice) {
                continue;
            }

            // price at target date
            $actualPrice = (float) Coin::getPriceAtTimeCMC($coinId, $targetDate);
            if (!$actualPrice) {
                continue;
            }

            $predictionPrice = ($actualPrice * (100 + $margin)) / 100;

            Prediction::factory()->create([
                'actual_price' => $actualPrice,
                'coin_id' => $coin['id'],
                'created_at' => $createdAt,
                'current_price' => $currentPrice,
                'margin' => $margin,
                'prediction_price' => $predictionPrice,
                'status' => $correct ? 'Correct' : 'Incorrect',
                'target_date' => $target,
                'user_id' => $user->id
            ]);

            sleep(2);
        }
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;
        $gender = $faker->randomElement(['male', 'female']);
        $separator = $faker->randomElement(['-', '_', '.']);
        $createdAt = $faker->dateTimeBetween('-14 months', 'now');
        $verifiedAt = $faker->dateTimeBetween($createdAt, '+35 minutes');
        $firstName = $gender === 'male' ? $faker->firstNameMale() : $faker->firstNameFemale();
        $lastName = $faker->lastName();
        $name = $firstName . ' ' . $lastName;
        $username = $firstName . $separator . $lastName . '' . mt_rand(10, 9999);
        $password = Str::random(mt_rand(8, 24));

        $contents = file_get_contents('https://thispersondoesnotexist.com/image');
        $img = 'users/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, $contents);

        return [
            'bio' => '',
            'created_at' => $createdAt,
            'email' => $faker->unique()->safeEmail(),
            'email_verified_at' => $verifiedAt,
            'gender' => $gender,
            'has_api_access' => true,
            'img' => $img,
            'name' => $name,
            'password' => $password,
            'remember_token' => Str::random(10),
            'username' => $username
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
