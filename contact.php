<?php
/*
 * TEA – envoi du formulaire de contact (hébergement Infomaniak, PHP 8).
 * Les demandes générales vont à info@tea-rdc.com, les candidatures à rh@tea-rdc.com.
 * L'adresse d'expédition doit appartenir au domaine tea-rdc.com (exigence Infomaniak).
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

const DEST_GENERAL = 'info@tea-rdc.com';
const DEST_RH      = 'rh@tea-rdc.com';
const EXPEDITEUR   = 'no-reply@tea-rdc.com';

function reply(int $code, array $data): void { http_response_code($code); echo json_encode($data); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405, ['ok' => false, 'error' => 'method']);

// Piège à robots : ce champ caché doit rester vide.
if (!empty($_POST['website'] ?? '')) reply(200, ['ok' => true]);

// Limite simple : un envoi toutes les 30 secondes par visiteur.
session_start();
if (isset($_SESSION['tea_last']) && time() - (int)$_SESSION['tea_last'] < 30) reply(429, ['ok' => false, 'error' => 'wait']);

function clean(string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', strip_tags($v));
    return mb_substr($v, 0, $max);
}
$nom   = clean('nom', 120);
$tel   = clean('tel', 40);
$objet = clean('objet', 120);
$mail  = filter_var(trim((string)($_POST['mail'] ?? '')), FILTER_VALIDATE_EMAIL);
$msg   = mb_substr(trim(strip_tags((string)($_POST['msg'] ?? ''))), 0, 5000);
$lang  = (($_POST['lang'] ?? 'fr') === 'en') ? 'en' : 'fr';

if ($nom === '' || $mail === false) reply(422, ['ok' => false, 'error' => 'invalid']);

$candidature = (stripos($objet, 'candidature') !== false || stripos($objet, 'application') !== false);
$dest = $candidature ? DEST_RH : DEST_GENERAL;

$sujet = '=?UTF-8?B?' . base64_encode('[Site TEA] ' . ($objet ?: 'Message') . ' – ' . $nom) . '?=';
$corps = "Nouveau message reçu depuis le site TEA (" . strtoupper($lang) . ")\n\n"
       . "Nom : $nom\n"
       . "Téléphone : " . ($tel ?: '—') . "\n"
       . "E-mail : $mail\n"
       . "Objet : " . ($objet ?: '—') . "\n\n"
       . "Message :\n" . ($msg ?: '—') . "\n";
$entetes = implode("\r\n", [
    'From: Site TEA <' . EXPEDITEUR . '>',
    'Reply-To: ' . $mail,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$ok = mail($dest, $sujet, $corps, $entetes, '-f' . EXPEDITEUR);
if ($ok) $_SESSION['tea_last'] = time();
reply($ok ? 200 : 500, ['ok' => $ok]);
