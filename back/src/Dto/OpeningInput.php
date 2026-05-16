<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class OpeningInput
{
    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    #[Assert\Length(max: 255, maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères.')]
    public string $name = '';

    #[Assert\NotBlank(message: 'La couleur est obligatoire.')]
    #[Assert\Choice(
        choices: ['white', 'black'],
        message: 'La couleur doit être "white" ou "black".',
    )]
    public string $color = '';

    #[Assert\NotBlank(message: 'Le code ECO est obligatoire.')]
    #[Assert\Length(exactly: 3, exactMessage: 'Le code ECO doit contenir exactement {{ limit }} caractères.')]
    #[Assert\Regex(
        pattern: '/^[A-E]\d{2}$/i',
        message: 'Le code ECO doit être au format A00–E99 (ex: "C50").',
    )]
    public string $ecoCode = '';

    #[Assert\NotNull(message: 'Le niveau de maîtrise est obligatoire.')]
    #[Assert\Range(
        min: 1,
        max: 5,
        notInRangeMessage: 'Le niveau de maîtrise doit être entre {{ min }} et {{ max }}.',
    )]
    public int $masteryLevel = 1;

    #[Assert\Date(message: 'La date doit être au format YYYY-MM-DD.')]
    public ?string $lastStudiedAt = null;

    public ?string $notes = null;

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        $input = new self();

        if (isset($data['name']) && is_string($data['name'])) {
            $input->name = $data['name'];
        }

        if (isset($data['color']) && is_string($data['color'])) {
            $input->color = $data['color'];
        }

        if (isset($data['ecoCode']) && is_string($data['ecoCode'])) {
            $input->ecoCode = $data['ecoCode'];
        }

        if (isset($data['masteryLevel']) && is_int($data['masteryLevel'])) {
            $input->masteryLevel = $data['masteryLevel'];
        }

        if (isset($data['lastStudiedAt']) && is_string($data['lastStudiedAt'])) {
            $input->lastStudiedAt = $data['lastStudiedAt'];
        } elseif (array_key_exists('lastStudiedAt', $data) && $data['lastStudiedAt'] === null) {
            $input->lastStudiedAt = null;
        }

        if (isset($data['notes']) && is_string($data['notes'])) {
            $input->notes = $data['notes'];
        } elseif (array_key_exists('notes', $data) && $data['notes'] === null) {
            $input->notes = null;
        }

        return $input;
    }
}
