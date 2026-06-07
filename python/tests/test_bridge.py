from hadara.bridge import build_npx_command


def test_build_npx_command_pins_current_rc_runtime() -> None:
    assert build_npx_command(["doctor", "--json"]) == [
        "npx",
        "-y",
        "hadara@0.2.0-rc.1",
        "doctor",
        "--json",
    ]
