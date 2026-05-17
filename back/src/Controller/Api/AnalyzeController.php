<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\OpeningRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/openings', name: 'api_analyze_')]
class AnalyzeController extends AbstractController
{
    public function __construct(
        private readonly OpeningRepository $repository,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    #[Route('/{id}/analyze', name: 'analyze', methods: ['POST'])]
    public function analyze(int $id): JsonResponse
    {
        $apiKey = $_ENV['ANTHROPIC_API_KEY'] ?? '';
        if ($apiKey === '') {
            return $this->json(
                ['error' => 'ANTHROPIC_API_KEY non configurée.'],
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }

        $opening = $this->repository->find($id);
        if ($opening === null) {
            return $this->json(['error' => 'Ouverture introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $colorLabel = $opening->getColor()->value === 'white' ? 'Blancs' : 'Noirs';
        $notes = $opening->getNotes() ?? 'Aucune';

        $prompt = <<<PROMPT
Tu es un entraîneur d'échecs expérimenté. Analyse l'ouverture suivante en te concentrant sur les thèmes stratégiques généraux.

Règle importante : ne cite aucune séquence de coups précise — tu n'as pas accès à la partie jouée et tu risquerais d'inventer des variantes incorrectes. Reste sur les idées, les plans et la structure de pions.

Donne une réponse structurée en 4 points :
1. Idées stratégiques principales et structure de pions caractéristique
2. Avantages typiques pour les {$colorLabel} dans cette ouverture
3. Points de vigilance ou erreurs fréquentes des débutants
4. Un conseil concret pour progresser au niveau {$opening->getMasteryLevel()}/5

Ouverture : {$opening->getName()}
Code ECO : {$opening->getEcoCode()}
Couleur jouée : {$colorLabel}
Niveau de maîtrise actuel : {$opening->getMasteryLevel()}/5
Notes personnelles : {$notes}

Réponds en français, de manière concise et directement utilisable en pratique.
PROMPT;

        try {
            $response = $this->httpClient->request('POST', 'https://api.anthropic.com/v1/messages', [
                'headers' => [
                    'x-api-key' => $apiKey,
                    'anthropic-version' => '2023-06-01',
                    'content-type' => 'application/json',
                ],
                'json' => [
                    'model' => 'claude-haiku-4-5-20251001',
                    'max_tokens' => 1024,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt],
                    ],
                ],
            ]);

            /** @var array{content: array{0: array{text: string}}} $data */
            $data = $response->toArray();

            return $this->json(['analysis' => $data['content'][0]['text']]);
        } catch (\Throwable) {
            return $this->json(
                ['error' => 'Erreur lors de la communication avec l\'API d\'analyse.'],
                Response::HTTP_BAD_GATEWAY,
            );
        }
    }
}
