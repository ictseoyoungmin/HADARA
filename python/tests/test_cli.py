from __future__ import annotations

import subprocess

import pytest

from hadara import __version__
from hadara import cli


def test_version_is_python_bridge_preview() -> None:
    assert __version__ == "0.0.1"


def test_main_prints_friendly_message_when_node_is_missing(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setattr(cli.shutil, "which", lambda name: None)

    result = cli.main(["doctor", "--json"])

    captured = capsys.readouterr()
    assert result == 127
    assert captured.out == ""
    assert "bridge to the official Node.js runtime" in captured.err
    assert "Node.js 22+ and npx are required" in captured.err
    assert "npm install -g hadara@0.2.0-rc.1" in captured.err
    assert "A Python-native runtime is planned." in captured.err


def test_main_prints_friendly_message_when_npx_is_missing(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    def fake_which(name: str) -> str | None:
        return "/usr/bin/node" if name == "node" else None

    monkeypatch.setattr(cli.shutil, "which", fake_which)

    result = cli.main(["--help"])

    captured = capsys.readouterr()
    assert result == 127
    assert "Node.js 22+ and npx are required" in captured.err


def test_main_prints_friendly_message_when_node_is_too_old(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    def fake_which(name: str) -> str | None:
        return f"/usr/bin/{name}" if name in {"node", "npx"} else None

    monkeypatch.setattr(cli.shutil, "which", fake_which)
    monkeypatch.setattr(cli, "_detect_node_major_version", lambda node_path: 20)

    result = cli.main(["doctor", "--json"])

    captured = capsys.readouterr()
    assert result == 127
    assert "Node.js 22+ and npx are required" in captured.err


def test_main_delegates_to_pinned_npx_runtime(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    calls: list[list[str]] = []

    def fake_which(name: str) -> str | None:
        return f"/usr/bin/{name}" if name in {"node", "npx"} else None

    def fake_call(command: list[str]) -> int:
        calls.append(command)
        return 0

    monkeypatch.setattr(cli.shutil, "which", fake_which)
    monkeypatch.setattr(cli, "_detect_node_major_version", lambda node_path: 22)
    monkeypatch.setattr(subprocess, "call", fake_call)

    result = cli.main(["doctor", "--json"])

    assert result == 0
    assert calls == [["npx", "-y", "hadara@0.2.0-rc.1", "doctor", "--json"]]


def test_main_propagates_subprocess_exit_code(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(cli.shutil, "which", lambda name: f"/usr/bin/{name}")
    monkeypatch.setattr(cli, "_detect_node_major_version", lambda node_path: 22)
    monkeypatch.setattr(subprocess, "call", lambda command: 6)

    assert cli.main(["release", "gate", "--json"]) == 6
