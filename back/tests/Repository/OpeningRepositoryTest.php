<?php

declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\Opening;
use App\Enum\Color;
use App\Repository\OpeningRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class OpeningRepositoryTest extends KernelTestCase
{
    private EntityManagerInterface $em;
    private OpeningRepository $repository;

    protected function setUp(): void
    {
        self::bootKernel();

        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine.orm.entity_manager');
        $this->em = $em;

        /** @var OpeningRepository $repository */
        $repository = static::getContainer()->get(OpeningRepository::class);
        $this->repository = $repository;

        $schemaTool = new SchemaTool($this->em);
        $schemaTool->dropDatabase();
        $schemaTool->createSchema($this->em->getMetadataFactory()->getAllMetadata());
    }

    public function testSaveAndFindOpening(): void
    {
        $opening = $this->buildOpening('Gambit Dame', 'D06');
        $this->em->persist($opening);
        $this->em->flush();

        $found = $this->repository->find($opening->getId());

        $this->assertNotNull($found);
        $this->assertSame('Gambit Dame', $found->getName());
        $this->assertSame(Color::White, $found->getColor());
        $this->assertSame('D06', $found->getEcoCode());
        $this->assertSame(3, $found->getMasteryLevel());
    }

    public function testFindAllReturnsSavedOpenings(): void
    {
        $this->em->persist($this->buildOpening('Gambit Dame', 'D06'));
        $this->em->persist($this->buildOpening('Ruy Lopez', 'C60'));
        $this->em->flush();

        $openings = $this->repository->findAll();

        $this->assertCount(2, $openings);
    }

    private function buildOpening(string $name, string $ecoCode): Opening
    {
        $opening = new Opening();
        $opening->setName($name);
        $opening->setColor(Color::White);
        $opening->setEcoCode($ecoCode);
        $opening->setMasteryLevel(3);
        $opening->setLastStudiedAt(null);
        $opening->setNotes(null);

        return $opening;
    }
}
