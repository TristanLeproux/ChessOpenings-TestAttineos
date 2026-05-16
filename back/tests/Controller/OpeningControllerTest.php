<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OpeningControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    private const VALID_PAYLOAD = [
        'name' => 'Défense Sicilienne',
        'color' => 'black',
        'ecoCode' => 'B20',
        'masteryLevel' => 4,
        'lastStudiedAt' => '2026-05-10',
        'notes' => 'Variante Najdorf',
    ];

    protected function setUp(): void
    {
        $this->client = static::createClient();

        /** @var EntityManagerInterface $em */
        $em = $this->client->getContainer()->get('doctrine.orm.entity_manager');
        $schemaTool = new SchemaTool($em);
        $schemaTool->dropDatabase();
        $schemaTool->createSchema($em->getMetadataFactory()->getAllMetadata());
    }

    public function testListReturnsEmptyArrayWhenNoData(): void
    {
        $this->client->request('GET', '/api/openings');

        $this->assertResponseStatusCodeSame(200);

        $body = json_decode((string) $this->client->getResponse()->getContent(), true);
        $this->assertSame([], $body);
    }

    public function testCreateWithValidDataReturns201(): void
    {
        $this->client->request(
            'POST',
            '/api/openings',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            (string) json_encode(self::VALID_PAYLOAD),
        );

        $this->assertResponseStatusCodeSame(201);

        /** @var array<string, mixed> $body */
        $body = json_decode((string) $this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $body);
        $this->assertSame('Défense Sicilienne', $body['name']);
        $this->assertSame('black', $body['color']);
        $this->assertSame('B20', $body['ecoCode']);
        $this->assertSame(4, $body['masteryLevel']);
    }

    public function testCreateWithInvalidDataReturns400WithErrors(): void
    {
        $this->client->request(
            'POST',
            '/api/openings',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            (string) json_encode([
                'name' => '',
                'color' => 'purple',
                'ecoCode' => 'Z999',
                'masteryLevel' => 10,
            ]),
        );

        $this->assertResponseStatusCodeSame(400);

        /** @var array<string, mixed> $body */
        $body = json_decode((string) $this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('errors', $body);
        $this->assertArrayHasKey('name', $body['errors']);
        $this->assertArrayHasKey('color', $body['errors']);
        $this->assertArrayHasKey('masteryLevel', $body['errors']);
    }

    public function testShowNotFoundReturns404(): void
    {
        $this->client->request('GET', '/api/openings/999');

        $this->assertResponseStatusCodeSame(404);

        /** @var array<string, mixed> $body */
        $body = json_decode((string) $this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('error', $body);
    }

    public function testDeleteReturns204(): void
    {
        $this->client->request(
            'POST',
            '/api/openings',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            (string) json_encode(self::VALID_PAYLOAD),
        );
        /** @var array<string, mixed> $created */
        $created = json_decode((string) $this->client->getResponse()->getContent(), true);

        $this->client->request('DELETE', '/api/openings/' . $created['id']);
        $this->assertResponseStatusCodeSame(204);

        $this->client->request('GET', '/api/openings/' . $created['id']);
        $this->assertResponseStatusCodeSame(404);
    }
}
