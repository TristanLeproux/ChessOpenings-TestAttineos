<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Opening;

class OpeningOutput
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $color,
        public readonly string $ecoCode,
        public readonly int $masteryLevel,
        public readonly ?string $lastStudiedAt,
        public readonly ?string $notes,
        public readonly string $createdAt,
    ) {
    }

    public static function fromEntity(Opening $opening): self
    {
        return new self(
            id: $opening->getId(),
            name: $opening->getName(),
            color: $opening->getColor()->value,
            ecoCode: $opening->getEcoCode(),
            masteryLevel: $opening->getMasteryLevel(),
            lastStudiedAt: $opening->getLastStudiedAt()?->format('Y-m-d'),
            notes: $opening->getNotes(),
            createdAt: $opening->getCreatedAt()->format(\DateTimeInterface::ATOM),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'color' => $this->color,
            'ecoCode' => $this->ecoCode,
            'masteryLevel' => $this->masteryLevel,
            'lastStudiedAt' => $this->lastStudiedAt,
            'notes' => $this->notes,
            'createdAt' => $this->createdAt,
        ];
    }
}
