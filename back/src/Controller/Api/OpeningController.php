<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\OpeningInput;
use App\Dto\OpeningOutput;
use App\Entity\Opening;
use App\Enum\Color;
use App\Repository\OpeningRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/openings', name: 'api_opening_')]
class OpeningController extends AbstractController
{
    public function __construct(
        private readonly OpeningRepository $repository,
        private readonly EntityManagerInterface $em,
        private readonly ValidatorInterface $validator,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $openings = $this->repository->findAll();

        return $this->json(
            array_map(
                static fn(Opening $opening) => OpeningOutput::fromEntity($opening)->toArray(),
                $openings,
            ),
        );
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $opening = $this->repository->find($id);

        if ($opening === null) {
            return $this->json(['error' => 'Ouverture introuvable.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(OpeningOutput::fromEntity($opening)->toArray());
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Corps de requête JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $input = OpeningInput::fromArray($data);

        $errorResponse = $this->validateInput($input);
        if ($errorResponse !== null) {
            return $errorResponse;
        }

        $opening = new Opening();
        $this->hydrateFromInput($opening, $input);

        $this->em->persist($opening);
        $this->em->flush();

        return $this->json(OpeningOutput::fromEntity($opening)->toArray(), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $opening = $this->repository->find($id);

        if ($opening === null) {
            return $this->json(['error' => 'Ouverture introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Corps de requête JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $input = OpeningInput::fromArray($data);

        $errorResponse = $this->validateInput($input);
        if ($errorResponse !== null) {
            return $errorResponse;
        }

        $this->hydrateFromInput($opening, $input);
        $this->em->flush();

        return $this->json(OpeningOutput::fromEntity($opening)->toArray());
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $opening = $this->repository->find($id);

        if ($opening === null) {
            return $this->json(['error' => 'Ouverture introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($opening);
        $this->em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function validateInput(OpeningInput $input): ?JsonResponse
    {
        $violations = $this->validator->validate($input);

        if (count($violations) === 0) {
            return null;
        }

        $errors = [];
        foreach ($violations as $violation) {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }

        return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
    }

    private function hydrateFromInput(Opening $opening, OpeningInput $input): void
    {
        $opening->setName($input->name);
        $opening->setColor(Color::from($input->color));
        $opening->setEcoCode($input->ecoCode);
        $opening->setMasteryLevel($input->masteryLevel);
        $opening->setNotes($input->notes);

        if ($input->lastStudiedAt !== null) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', $input->lastStudiedAt);
            $opening->setLastStudiedAt($date instanceof \DateTimeImmutable ? $date : null);
        } else {
            $opening->setLastStudiedAt(null);
        }
    }
}
