<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\Color;
use App\Repository\OpeningRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OpeningRepository::class)]
#[ORM\Table(name: 'opening')]
class Opening
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private int $id;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private string $name;

    #[ORM\Column(type: Types::STRING, enumType: Color::class)]
    private Color $color;

    #[ORM\Column(type: Types::STRING, length: 3)]
    private string $ecoCode;

    #[ORM\Column(type: Types::SMALLINT)]
    private int $masteryLevel;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $lastStudiedAt;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getColor(): Color
    {
        return $this->color;
    }

    public function setColor(Color $color): static
    {
        $this->color = $color;

        return $this;
    }

    public function getEcoCode(): string
    {
        return $this->ecoCode;
    }

    public function setEcoCode(string $ecoCode): static
    {
        $this->ecoCode = $ecoCode;

        return $this;
    }

    public function getMasteryLevel(): int
    {
        return $this->masteryLevel;
    }

    public function setMasteryLevel(int $masteryLevel): static
    {
        $this->masteryLevel = $masteryLevel;

        return $this;
    }

    public function getLastStudiedAt(): ?\DateTimeImmutable
    {
        return $this->lastStudiedAt;
    }

    public function setLastStudiedAt(?\DateTimeImmutable $lastStudiedAt): static
    {
        $this->lastStudiedAt = $lastStudiedAt;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
